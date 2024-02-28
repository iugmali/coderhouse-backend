const sum = async (num1, num2) => {
  return new Promise((resolve, reject) => {
    if (num1 === 0 || num2 === 0) {
      reject(new Error("Operação desnecessária"))
    }
    const result = num1 + num2;
    if (result < 0) {
      reject(new Error("A calculadora deve retornar apenas valores positivos"))
    }
    resolve(result);
  });
}

const subtract = async (num1, num2) => {
  return new Promise((resolve, reject) => {
    if (num1 === 0 || num2 === 0) {
      reject(new Error("Operação inválida"))
    }
    const result = num1 - num2;
    if (result < 0) {
      reject(new Error("A calculadora só pode retornar valores positivos"))
    }
    resolve(result);
  });
}

const multiply = async (num1, num2) => {
  return new Promise((resolve, reject) => {
    if (num1 < 0 || num2 < 0) {
      reject(new Error("Operação inválida"))
    }
    const result = num1 * num2;
    if (result < 0) {
      reject(new Error("A calculadora só pode retornar valores positivos"))
    }
    resolve(result);
  });
}

const divide = async (num1, num2) => {
  return new Promise((resolve, reject) => {
    if (num1 === 0 || num2 === 0) {
      reject(new Error("Operação inválida"))
    }
    const result = num1 / num2;
    if (result < 0) {
      reject(new Error("A calculadora só pode retornar valores positivos"))
    }
    resolve(result);
  });
}

const calculator = async () => {
  try {
    const soma = await sum(4, 2);
    console.log(soma);
    const subtracao = await subtract(4, 2);
    console.log(subtracao);
    const multiplicacao = await multiply(4, 2);
    console.log(multiplicacao);
    const divisao = await divide(4, 2);
    console.log(divisao);
  } catch (e) {
    console.error(e)
  }
}

calculator().catch(e => console.error(e));
