const fs = require('fs');
const ProductManager = require('./ProductManager');

fs.unlink("./products.json", (e) => {});

const productManager = new ProductManager("./products.json");

async function main(){
  let products = [];
  // Tentativa de adicionar um produto com um dos campos vazio:
  await productManager.addProduct({
    title: "",
    description: "Camiseta MERN XL",
    price: 49_99,
    thumbnail: "http://example.com/mern.jpg",
    code: "P01AA",
    stock: 10
  });
  // console exibirá "Todos os campos são obrigatórios." e não adicionará o produto

  // Adicionando o primeiro produto...
  await productManager.addProduct({
    title: "Camiseta",
    description: "Camiseta MERN XL",
    price: 49_99,
    thumbnail: "http://example.com/mern.jpg",
    code: "P01AA",
    stock: 10
  });

  // Tentativa de adicionar o segundo produto com o mesmo código do primeiro:
  await productManager.addProduct({
    title: "Outra Camiseta",
    description: "Mesmo código da primeira",
    price: 19_99,
    thumbnail: "http://example.com",
    code: "P01AA",
    stock: 20
  });
  // console exibirá "Código já existe." e não adicionará o produto

  // Adicionando o segundo produto...
  await productManager.addProduct({
    title: "Notebook Dell",
    description: "Notebook Dell Vostro 5471",
    price: 2_999_99,
    thumbnail: "http://example.com/vostro5471.jpg",
    code: "P01BB",
    stock: 50
  });

  // Produtos após o segundo produto ser adicionado:
  products = await productManager.getProducts();
  console.log(products);
  // o segundo produto adicionado vai ser exibido no array de produtos

  // Tentativa de buscar um produto com um ‘id’ inexistente:
  await productManager.getProductById(7);
  // console exibirá "Não encontrado", conforme pedido para o exercício

  // Produto retornado ao buscar um produto com um ‘id’ 2 (existente):
  const product2 = await productManager.getProductById(2);
  console.log(product2);
  // retornará o segundo produto adicionado

  // Atualizando soment o nome do produto de ‘id’ 1
  await productManager.updateProduct(1, {title: "Resolvi mudar apenas o nome da camiseta"});
  // Atualizando somente o preço do produto de 'id'1
  await productManager.updateProduct(1, {price: 300_00});
  // Produto1 após ser atualizado:
  const product1 = await productManager.getProductById(1);
  console.log(product1);

  // Adicionando o terceiro produto...
  await productManager.addProduct({
    title: "Celular Apple",
    description: "iPhone SE (3rd gen)",
    price: 2_399_99,
    thumbnail: "http://example.com/vostro5471.jpg",
    code: "P01CC",
    stock: 20
  });

  // Deletando o produto de 'id' 2
  await productManager.deleteProduct(2);
  // Produtos após o produto de id '2' ser removido (só restaram o primeiro e o terceiro):
  products = await productManager.getProducts();
  console.log(products);
}

main().catch(e => console.error(e));
