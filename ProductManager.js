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

const productManager = new ProductManager();
module.exports = {productManager}
