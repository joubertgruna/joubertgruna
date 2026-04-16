/**
 * Valida CNPJ usando algoritmo de dígitos verificadores
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean}
 */
function validarCNPJ(cnpj) {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * peso[i];
  }
  
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cnpj[12]) !== digito1) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * peso[i];
  }
  
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(cnpj[13]) === digito2;
}

/**
 * Formata CNPJ para exibição
 * @param {string} cnpj - CNPJ apenas números
 * @returns {string} - CNPJ formatado XX.XXX.XXX/XXXX-XX
 */
function formatarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Arredonda valor para 2 casas decimais (padrão monetário)
 * @param {number} valor 
 * @returns {number}
 */
function arredondarMonetario(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

module.exports = {
  validarCNPJ,
  formatarCNPJ,
  arredondarMonetario
};
