class ProductManager {
  products = [];

  constructor(products = []) {
    this.products = products;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (this.products.find((product) => product.code === code)) {
      console.error("Código já existe.");
      return;
    }
    if (title.trim() === "" || description.trim() === "" || price <= 0 || thumbnail.trim() === "" || code.trim() === "" || stock <= 0) {
      console.error("Todos os campos são obrigatórios.");
      return;
    }
    const lastId = this.products[this.products.length - 1]?.id ?? 0;
    const product = {
      id: lastId + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    }
    this.products.push(product);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error("Não encontrado");
      return;
    }
    return product;
  }
}

// Rodando...
// Detalhe: Eu estou considerando centavos como inteiros, e utilizando o "_" (introduzido no ES12) para facilitar a leitura

const productManager = new ProductManager();

console.log("Tentativa de adicionar um produto com um campo vazio:");
productManager.addProduct("", "Camiseta MERN XL", 49_99, "http://example.com/mern.jpg", "P01AA", 10);
// console exibirá "Todos os campos são obrigatórios." e não adicionará o produto

console.log("Adicionando o primeiro produto...");
productManager.addProduct("Camiseta", "Camiseta MERN XL", 49_99, "http://example.com/mern.jpg", "P01AA", 10);
console.log("Produtos após o primeiro produto ser adicionado:");
console.log(productManager.products);
// o produto adicionado vai ser exibido no array de produtos

console.log("Tentativa de adicionar o segundo produto com o mesmo código do primeiro:");
productManager.addProduct("Outra Camiseta", "Mesmo código da primeira", 19_99, "http://example.com", "P01AA", 10);
// console exibirá "Código já existe." e não adicionará o produto

console.log("Adicionando o segundo produto...");
productManager.addProduct("Notebook Dell", "Notebook Dell Vostro 5471", 2_999_99, "http://example.com", "P01BB", 50);
console.log("Produtos após o segundo produto ser adicionado:");
console.log(productManager.products);
// o segundo produto adicionado vai ser exibido no array de produtos

console.log("Tentativa de buscar um produto com um id inexistente:");
const product1 = productManager.getProductById(7);
// console exibirá "Não encontrado", conforme pedido para o exercício

console.log("Produto retornado ao buscar um produto com um id 2 (existente):");
const product2 = productManager.getProductById(2);
console.log(product2);
// retornará o segundo produto adicionado
