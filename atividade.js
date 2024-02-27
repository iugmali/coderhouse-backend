const objetos = [
  {
    macas: 3,
    peras: 2,
    carne: 1,
    frango: 5,
    doces: 2
  },
  {
    macas: 1,
    cafes: 1,
    ovos: 6,
    frango: 1,
    paes: 4
  }
]

const tiposProdutos = [];

objetos.forEach((objeto) => {
  const produtos = Object.keys(objeto);
  produtos.forEach((produto) => {
    if (tiposProdutos.includes(produto)) {
      return;
    }
    tiposProdutos.push(produto)
  })
})
console.log(tiposProdutos);

let totalProdutosVendidos = 0;

objetos.forEach((objeto) => {
  const totais = Object.values(objeto);
  totais.forEach((total) => {
    totalProdutosVendidos += total;
  })
})
console.log(totalProdutosVendidos);
