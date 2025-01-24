

export function isValidCI(cedula: string) {
  // Validar formato con regex
  const regex = /^\d{10}$/;
  if (!regex.test(cedula)) return false;

  // Validar el número de cédula con el algoritmo ecuatoriano
  const digitos = cedula.split('').map(Number);
  const codigoProvincia = parseInt(cedula.substring(0, 2), 10);

  // El código de provincia debe estar entre 1 y 24
  // (o 30 para cédulas emitidas por extranjeros)
  if (codigoProvincia < 1 || (codigoProvincia > 24 && codigoProvincia !== 30)) {
    return false;
  }

  const digitoVerificador = digitos.pop();
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const suma = digitos.reduce((acc, val, index) => {
    let multiplicacion = val * coeficientes[index];
    if (multiplicacion > 9) {
      multiplicacion -= 9;
    }
    return acc + multiplicacion;
  }, 0);

  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

  return digitoCalculado === digitoVerificador;
}

