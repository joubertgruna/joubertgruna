const { arredondarMonetario } = require('../utils/validators');

/**
 * Tabelas do Simples Nacional - Anexos I a V
 * Valores atualizados conforme legislação vigente
 */
const ANEXOS_SIMPLES = {
  // Anexo I - Comércio
  I: {
    nome: 'Comércio',
    faixas: [
      { limite: 180000, aliquota: 4.00, deducao: 0 },
      { limite: 360000, aliquota: 7.30, deducao: 5940 },
      { limite: 720000, aliquota: 9.50, deducao: 13860 },
      { limite: 1800000, aliquota: 10.70, deducao: 22500 },
      { limite: 3600000, aliquota: 14.30, deducao: 87300 },
      { limite: 4800000, aliquota: 19.00, deducao: 378000 }
    ]
  },
  // Anexo II - Indústria
  II: {
    nome: 'Indústria',
    faixas: [
      { limite: 180000, aliquota: 4.50, deducao: 0 },
      { limite: 360000, aliquota: 7.80, deducao: 5940 },
      { limite: 720000, aliquota: 10.00, deducao: 13860 },
      { limite: 1800000, aliquota: 11.20, deducao: 22500 },
      { limite: 3600000, aliquota: 14.70, deducao: 85500 },
      { limite: 4800000, aliquota: 30.00, deducao: 720000 }
    ]
  },
  // Anexo III - Serviços (Fator R >= 28%)
  III: {
    nome: 'Serviços (Fator R >= 28%)',
    faixas: [
      { limite: 180000, aliquota: 6.00, deducao: 0 },
      { limite: 360000, aliquota: 11.20, deducao: 9360 },
      { limite: 720000, aliquota: 13.50, deducao: 17640 },
      { limite: 1800000, aliquota: 16.00, deducao: 35640 },
      { limite: 3600000, aliquota: 21.00, deducao: 125640 },
      { limite: 4800000, aliquota: 33.00, deducao: 648000 }
    ]
  },
  // Anexo IV - Serviços (construção, vigilância, limpeza)
  IV: {
    nome: 'Serviços (sem CPP)',
    faixas: [
      { limite: 180000, aliquota: 4.50, deducao: 0 },
      { limite: 360000, aliquota: 9.00, deducao: 8100 },
      { limite: 720000, aliquota: 10.20, deducao: 12420 },
      { limite: 1800000, aliquota: 14.00, deducao: 39780 },
      { limite: 3600000, aliquota: 22.00, deducao: 183780 },
      { limite: 4800000, aliquota: 33.00, deducao: 828000 }
    ]
  },
  // Anexo V - Serviços (Fator R < 28%)
  V: {
    nome: 'Serviços (Fator R < 28%)',
    faixas: [
      { limite: 180000, aliquota: 15.50, deducao: 0 },
      { limite: 360000, aliquota: 18.00, deducao: 4500 },
      { limite: 720000, aliquota: 19.50, deducao: 9900 },
      { limite: 1800000, aliquota: 20.50, deducao: 17100 },
      { limite: 3600000, aliquota: 23.00, deducao: 62100 },
      { limite: 4800000, aliquota: 30.50, deducao: 540000 }
    ]
  }
};

class SimplesNacionalService {
  /**
   * Calcula o DAS (Documento de Arrecadação do Simples Nacional)
   * 
   * @param {object} params
   * @param {number} params.faturamentoBrutoMensal - Faturamento do mês de apuração
   * @param {number} params.faturamentoAcumulado12m - RBT12 (últimos 12 meses)
   * @param {string} params.anexo - 'I', 'II', 'III', 'IV' ou 'V'
   * @param {number} params.folhaPagamento12m - Para cálculo do Fator R (Anexo III/V)
   * @returns {object} Detalhamento do cálculo do DAS
   */
  calcularDAS({ faturamentoBrutoMensal, faturamentoAcumulado12m, anexo, folhaPagamento12m = 0 }) {
    // Verifica se está dentro do limite do Simples
    if (faturamentoAcumulado12m > 4800000) {
      return {
        erro: true,
        mensagem: 'Empresa excedeu o limite de R$ 4.800.000,00 do Simples Nacional'
      };
    }

    // Determina anexo correto baseado no Fator R (para serviços)
    let anexoEfetivo = anexo;
    let fatorR = null;

    if (anexo === 'III' || anexo === 'V') {
      fatorR = faturamentoAcumulado12m > 0 
        ? arredondarMonetario((folhaPagamento12m / faturamentoAcumulado12m) * 100) 
        : 0;

      // Se Fator R >= 28%, usa Anexo III (mais favorável)
      // Se Fator R < 28%, usa Anexo V
      anexoEfetivo = fatorR >= 28 ? 'III' : 'V';
    }

    const tabelaAnexo = ANEXOS_SIMPLES[anexoEfetivo];
    if (!tabelaAnexo) {
      return { erro: true, mensagem: 'Anexo inválido' };
    }

    // Encontra a faixa correta baseada no RBT12
    const faixaIndex = tabelaAnexo.faixas.findIndex(f => faturamentoAcumulado12m <= f.limite);
    const faixa = faixaIndex >= 0 ? tabelaAnexo.faixas[faixaIndex] : tabelaAnexo.faixas[tabelaAnexo.faixas.length - 1];
    const faixaNumero = faixaIndex >= 0 ? faixaIndex + 1 : tabelaAnexo.faixas.length;
    if (!faixa) {
      return { erro: true, mensagem: 'Faixa não encontrada' };
    }

    // Cálculo da alíquota efetiva
    // Alíquota Efetiva = [(RBT12 × Aliq) - PD] / RBT12
    const aliquotaNominal = faixa.aliquota;
    const parcelaADeduzir = faixa.deducao;

    const aliquotaEfetiva = faturamentoAcumulado12m > 0
      ? arredondarMonetario(((faturamentoAcumulado12m * (aliquotaNominal / 100)) - parcelaADeduzir) / faturamentoAcumulado12m * 100)
      : aliquotaNominal;

    // Valor do DAS
    const valorDAS = arredondarMonetario(faturamentoBrutoMensal * (aliquotaEfetiva / 100));

    return {
      erro: false,
      anexo: anexoEfetivo,
      nomeAnexo: tabelaAnexo.nome,
      faturamentoBrutoMensal,
      faturamentoAcumulado12m,
      faixaNumero,
      faixaAtual: {
        limite: faixa.limite,
        aliquotaNominal: aliquotaNominal,
        parcelaADeduzir: parcelaADeduzir
      },
      fatorR,
      aliquotaEfetiva,
      valorDAS,
      detalhamento: {
        formula: '[(RBT12 × Alíquota) - Parcela a Deduzir] / RBT12',
        calculo: `[(${faturamentoAcumulado12m} × ${aliquotaNominal}%) - ${parcelaADeduzir}] / ${faturamentoAcumulado12m} = ${aliquotaEfetiva}%`,
        valorFinal: `${faturamentoBrutoMensal} × ${aliquotaEfetiva}% = R$ ${valorDAS.toFixed(2)}`
      }
    };
  }

  /**
   * Retorna as tabelas de todos os anexos
   */
  getTabelasAnexos() {
    return ANEXOS_SIMPLES;
  }

  /**
   * Verifica em qual anexo a empresa se enquadra baseado no CNAE
   * @param {string} cnae - Código CNAE
   * @returns {string} - Anexo sugerido (I, II, III, IV ou V)
   */
  getAnexoPorCNAE(cnae) {
    // Simplificação - em produção, usar tabela completa de CNAE
    const cnaePrimarios = cnae.substring(0, 2);
    
    // Comércio (Anexo I)
    if (['45', '46', '47'].includes(cnaePrimarios)) return 'I';
    
    // Indústria (Anexo II)
    if (['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33'].includes(cnaePrimarios)) return 'II';
    
    // Construção e serviços especiais (Anexo IV)
    if (['41', '42', '43', '80'].includes(cnaePrimarios)) return 'IV';
    
    // Serviços em geral (Anexo III ou V - depende do Fator R)
    return 'V';
  }
}

module.exports = new SimplesNacionalService();
