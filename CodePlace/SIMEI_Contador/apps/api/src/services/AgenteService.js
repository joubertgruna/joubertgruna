const OpenAI = require('openai');
const EmpresaService = require('./EmpresaService');
const LancamentoService = require('./LancamentoService');
const SimplesNacionalService = require('./SimplesNacionalService');
const { query } = require('../config/database');
const logger = require('../utils/logger');

// GitHub Models é 100% compatível com o SDK da OpenAI.
// Usa seu GITHUB_TOKEN (mesmo do GitHub Copilot) como autenticação.
// Endpoint: https://models.inference.ai.azure.com
const openai = new OpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN,
});

const empresaService = EmpresaService;
const lancamentoService = LancamentoService;
const simplesService = SimplesNacionalService;

// ─────────────────────────────────────────────
// Definição das ferramentas disponíveis ao agente
// ─────────────────────────────────────────────
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'buscar_dashboard',
      description:
        'Busca os dados financeiros consolidados do dashboard da empresa: faturamento do mês, despesas, saldo, lançamentos recentes e comparativo anual.',
      parameters: {
        type: 'object',
        properties: {
          empresa_id: { type: 'number', description: 'ID da empresa' },
          periodo: {
            type: 'string',
            description: 'Período no formato YYYY-MM (ex: 2026-04). Se omitido, usa o mês atual.',
          },
        },
        required: ['empresa_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listar_lancamentos',
      description:
        'Lista os lançamentos contábeis da empresa (receitas e despesas) com paginação e filtros opcionais.',
      parameters: {
        type: 'object',
        properties: {
          empresa_id: { type: 'number', description: 'ID da empresa' },
          tipo: {
            type: 'string',
            enum: ['receita', 'despesa'],
            description: 'Filtrar por tipo de lançamento',
          },
          data_inicio: { type: 'string', description: 'Data inicial no formato YYYY-MM-DD' },
          data_fim: { type: 'string', description: 'Data final no formato YYYY-MM-DD' },
          page: { type: 'number', description: 'Página (padrão 1)' },
          limit: { type: 'number', description: 'Itens por página (padrão 10, máx 50)' },
        },
        required: ['empresa_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'criar_lancamento',
      description:
        'Cria um novo lançamento contábil (receita ou despesa) para a empresa.',
      parameters: {
        type: 'object',
        properties: {
          empresa_id: { type: 'number', description: 'ID da empresa' },
          tipo: { type: 'string', enum: ['receita', 'despesa'], description: 'Tipo do lançamento' },
          descricao: { type: 'string', description: 'Descrição do lançamento' },
          valor: { type: 'number', description: 'Valor em reais (positivo)' },
          data: { type: 'string', description: 'Data no formato YYYY-MM-DD' },
          categoria: { type: 'string', description: 'Categoria (ex: vendas, aluguel, salario)' },
          documento: { type: 'string', description: 'Número do documento ou NF (opcional)' },
        },
        required: ['empresa_id', 'tipo', 'descricao', 'valor', 'data'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calcular_das',
      description:
        'Calcula o DAS (Documento de Arrecadação do Simples Nacional) com base no faturamento e anexo da empresa.',
      parameters: {
        type: 'object',
        properties: {
          faturamento_mensal: { type: 'number', description: 'Faturamento bruto do mês de competência em reais' },
          faturamento_12m: { type: 'number', description: 'Faturamento acumulado dos últimos 12 meses em reais' },
          anexo: {
            type: 'string',
            enum: ['I', 'II', 'III', 'IV', 'V'],
            description: 'Anexo do Simples Nacional: I=Comércio, II=Indústria, III/IV/V=Serviços',
          },
          folha_12m: {
            type: 'number',
            description: 'Folha de pagamento dos últimos 12 meses (usado no Fator R para Anexos III/V)',
          },
        },
        required: ['faturamento_mensal', 'faturamento_12m', 'anexo'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'buscar_empresa',
      description: 'Busca os dados cadastrais da empresa (CNPJ, razão social, regime, endereço).',
      parameters: {
        type: 'object',
        properties: {
          empresa_id: { type: 'number', description: 'ID da empresa' },
        },
        required: ['empresa_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listar_empresas',
      description: 'Lista todas as empresas cadastradas no sistema (somente admins).',
      parameters: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Página (padrão 1)' },
          limit: { type: 'number', description: 'Itens por página (padrão 10)' },
          search: { type: 'string', description: 'Filtro por nome ou CNPJ' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'buscar_relatorio_dre',
      description:
        'Gera a Demonstração do Resultado do Exercício (DRE): receita bruta, despesas e lucro líquido de um período.',
      parameters: {
        type: 'object',
        properties: {
          empresa_id: { type: 'number', description: 'ID da empresa' },
          ano: { type: 'number', description: 'Ano (ex: 2026)' },
          mes: { type: 'number', description: 'Mês 1-12. Se omitido, retorna o ano todo.' },
        },
        required: ['empresa_id', 'ano'],
      },
    },
  },
];

// ─────────────────────────────────────────────
// Execução das ferramentas
// ─────────────────────────────────────────────
async function executarFerramenta(nome, args, contexto) {
  logger.info(`[Agente] Executando ferramenta: ${nome}`, args);

  switch (nome) {
    case 'buscar_dashboard': {
      const empresa = await empresaService.findById(args.empresa_id);
      const periodo = args.periodo || new Date().toISOString().slice(0, 7);
      const [ano, mes] = periodo.split('-').map(Number);

      const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${ano}-${String(mes).padStart(2, '0')}-${ultimoDia}`;

      const [receitas] = await query(
        `SELECT COALESCE(SUM(valor),0) as total FROM lancamentos
         WHERE empresa_id = ? AND tipo = 'receita' AND data BETWEEN ? AND ? AND deleted_at IS NULL`,
        [args.empresa_id, dataInicio, dataFim]
      );
      const [despesas] = await query(
        `SELECT COALESCE(SUM(valor),0) as total FROM lancamentos
         WHERE empresa_id = ? AND tipo = 'despesa' AND data BETWEEN ? AND ? AND deleted_at IS NULL`,
        [args.empresa_id, dataInicio, dataFim]
      );
      const [lancamentosRecentes] = await query(
        `SELECT tipo, descricao, valor, data FROM lancamentos
         WHERE empresa_id = ? AND deleted_at IS NULL ORDER BY data DESC LIMIT 5`,
        [args.empresa_id]
      ) || [[]];

      const totalReceitas = Number(receitas?.total || 0);
      const totalDespesas = Number(despesas?.total || 0);

      return {
        empresa: empresa.razao_social,
        periodo,
        faturamento: totalReceitas,
        despesas: totalDespesas,
        resultado: totalReceitas - totalDespesas,
        lancamentos_recentes: Array.isArray(lancamentosRecentes) ? lancamentosRecentes : [],
      };
    }

    case 'listar_lancamentos': {
      const result = await lancamentoService.findByEmpresa(args.empresa_id, {
        tipo: args.tipo,
        dataInicio: args.data_inicio,
        dataFim: args.data_fim,
        page: args.page || 1,
        limit: Math.min(args.limit || 10, 50),
      });
      return result;
    }

    case 'criar_lancamento': {
      const novo = await lancamentoService.create({
        empresa_id: args.empresa_id,
        tipo: args.tipo,
        descricao: args.descricao,
        valor: args.valor,
        data: args.data,
        categoria: args.categoria || null,
        documento: args.documento || null,
        usuario_id: contexto.usuario_id || null,
      });
      return { sucesso: true, lancamento: novo };
    }

    case 'calcular_das': {
      const resultado = simplesService.calcularDAS({
        faturamentoMes: args.faturamento_mensal,
        faturamentoAcumulado12m: args.faturamento_12m,
        anexo: args.anexo,
        folhaPagamento12m: args.folha_12m || 0,
      });
      return {
        anexo: args.anexo,
        faixa: resultado.faixaNumero,
        aliquota_efetiva: resultado.aliquotaEfetiva,
        valor_das: resultado.valorDAS,
        fator_r: resultado.fatorR || null,
        deducao: resultado.deducao,
      };
    }

    case 'buscar_empresa': {
      return await empresaService.findById(args.empresa_id);
    }

    case 'listar_empresas': {
      return await empresaService.findAll({
        page: args.page || 1,
        limit: args.limit || 10,
        search: args.search || '',
      });
    }

    case 'buscar_relatorio_dre': {
      const ano = args.ano;
      const mes = args.mes;
      const dataInicio = mes
        ? `${ano}-${String(mes).padStart(2, '0')}-01`
        : `${ano}-01-01`;
      const dataFim = mes
        ? `${ano}-${String(mes).padStart(2, '0')}-${new Date(ano, mes, 0).getDate()}`
        : `${ano}-12-31`;

      const [receitaRow] = await query(
        `SELECT COALESCE(SUM(valor),0) as total FROM lancamentos
         WHERE empresa_id = ? AND tipo = 'receita' AND data BETWEEN ? AND ? AND deleted_at IS NULL`,
        [args.empresa_id, dataInicio, dataFim]
      );
      const [despesaRow] = await query(
        `SELECT COALESCE(SUM(valor),0) as total FROM lancamentos
         WHERE empresa_id = ? AND tipo = 'despesa' AND data BETWEEN ? AND ? AND deleted_at IS NULL`,
        [args.empresa_id, dataInicio, dataFim]
      );
      const categorias = await query(
        `SELECT categoria, tipo, COALESCE(SUM(valor),0) as total FROM lancamentos
         WHERE empresa_id = ? AND data BETWEEN ? AND ? AND deleted_at IS NULL
         GROUP BY categoria, tipo ORDER BY total DESC`,
        [args.empresa_id, dataInicio, dataFim]
      );

      const receita = Number(receitaRow?.total || 0);
      const despesa = Number(despesaRow?.total || 0);

      return {
        periodo: { dataInicio, dataFim },
        receita_bruta: receita,
        despesas_operacionais: despesa,
        resultado_liquido: receita - despesa,
        margem_liquida: receita > 0 ? ((receita - despesa) / receita * 100).toFixed(2) : '0.00',
        por_categoria: categorias,
      };
    }

    default:
      return { erro: `Ferramenta desconhecida: ${nome}` };
  }
}

// ─────────────────────────────────────────────
// Prompt de sistema
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é o **SIMEI Assistente** — um agente contábil especializado em Simples Nacional.

Seu papel é ajudar empresários a:
- Entender seus dados financeiros (faturamento, despesas, resultados)
- Registrar receitas e despesas
- Calcular o DAS mensal
- Interpretar relatórios (DRE, balancete)
- Tirar dúvidas sobre o Simples Nacional e MEI

**Regras:**
1. Responda **sempre em português do Brasil**, de forma clara, direta e amigável.
2. Quando precisar de dados, use as ferramentas disponíveis — nunca invente valores.
3. Ao mostrar valores monetários, use o formato R$ 1.234,56.
4. Ao apresentar alíquotas, use percentual com 2 casas (ex: 4,00%).
5. Se o usuário pedir para criar um lançamento, confirme os dados antes e depois informe o sucesso.
6. Hoje é ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;

// ─────────────────────────────────────────────
// Função principal: loop de conversação com tool use
// ─────────────────────────────────────────────
async function chat({ messages, empresa_id, usuario_id, is_admin = false }) {
  const contexto = { empresa_id, usuario_id, is_admin };

  // Monta histórico com system prompt
  const historicoOpenAI = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  const ferramentasUsadas = [];
  let iteracoes = 0;
  const MAX_ITERACOES = 8; // evita loops infinitos

  while (iteracoes < MAX_ITERACOES) {
    iteracoes++;

    const resposta = await openai.chat.completions.create({
      model: process.env.GITHUB_MODEL || 'gpt-4o-mini',
      messages: historicoOpenAI,
      tools: TOOLS,
      tool_choice: 'auto',
      temperature: 0.3,
      max_tokens: 2048,
    });

    const mensagem = resposta.choices[0].message;
    historicoOpenAI.push(mensagem);

    // Sem tool calls → resposta final
    if (!mensagem.tool_calls || mensagem.tool_calls.length === 0) {
      return {
        content: mensagem.content,
        ferramentas_usadas: ferramentasUsadas,
        tokens: resposta.usage,
      };
    }

    // Executa cada tool call em paralelo
    const resultados = await Promise.all(
      mensagem.tool_calls.map(async (tc) => {
        const args = JSON.parse(tc.function.arguments);
        ferramentasUsadas.push(tc.function.name);

        let resultado;
        try {
          resultado = await executarFerramenta(tc.function.name, args, contexto);
        } catch (err) {
          logger.error(`[Agente] Erro na ferramenta ${tc.function.name}:`, err.message);
          resultado = { erro: err.message };
        }

        return {
          role: 'tool',
          tool_call_id: tc.id,
          content: JSON.stringify(resultado),
        };
      })
    );

    historicoOpenAI.push(...resultados);
  }

  return {
    content: 'Desculpe, não consegui concluir a operação. Tente reformular sua pergunta.',
    ferramentas_usadas: ferramentasUsadas,
    tokens: null,
  };
}

module.exports = { chat };
