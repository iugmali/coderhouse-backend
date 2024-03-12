const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Operações via fs em métodos privados

  #readProducts = async () => {
    try {
      const fileData = await fs.promises.readFile(this.path, "utf-8");
      if (!fileData.trim()) {
        return [];
      }
      return JSON.parse(fileData);
    } catch (e) {
      if (e.code === 'ENOENT') {
        await fs.promises.writeFile(this.path, '[]');
        return [];
      }
      throw e;
    }
  }

  #saveProducts = async (products) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (e) {
      throw e;
    }
  }

  // Métodos solicitados em Desafio Obrigatório

  getProducts = async () => {
    try {
      return await this.#readProducts();
    } catch (e) {
      throw e;
    }
  };

  addProduct = async ({title, description, price, thumbnail, code, stock}) => {
    try {
      if (title.trim() === "" || description.trim() === "" || price <= 0 || thumbnail.trim() === "" || code.trim() === "" || stock <= 0) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      const products = await this.#readProducts();
      if (products.find((product) => product.code === code)) {
        throw new Error("Código já existe.");
      }
      const lastId = products[products.length - 1]?.id ?? 0;
      const product = {
        id: lastId + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      }
      products.push(product);
      await this.#saveProducts(products);
    } catch (e) {
      throw e;
    }
  }


  getProductById = async (id) => {
    try {
      const products = await this.#readProducts();
      const product = products.find((product) => product.id === id);
      if (!product) {
        throw new Error("Não encontrado");
      }
      return product;
    } catch (e) {
      throw e;
    }
  }

  updateProduct = async (id, enteredProduct) => {
    try {
      const products = await this.#readProducts();
      let index;
      const product = products.find((product, i) => {
        index = i;
        return product.id === id;
      });
      if (!product) {
        throw new Error("Não encontrado");
      }
      const updatedProduct = {
        id: product.id,
        title: (!enteredProduct?.title?.trim()) ? product.title : enteredProduct.title,
        description: (!enteredProduct?.description?.trim()) ? product.description : enteredProduct.description,
        price: (!enteredProduct?.price) ? product.price : (enteredProduct.price <= 0) ? product.price : enteredProduct.price,
        thumbnail: (!enteredProduct?.thumbnail?.trim()) ? product.thumbnail : enteredProduct.thumbnail,
        code: (!enteredProduct?.code?.trim()) ? product.code : enteredProduct.code,
        stock: (!enteredProduct?.stock) ? product.stock : (enteredProduct.stock <= 0) ? product.stock : enteredProduct.stock,
      };
      products.splice(index, 1, updatedProduct);
      await this.#saveProducts(products);
    } catch (e) {
      throw e;
    }
  }

  deleteProduct = async (id) => {
    try {
      const products = await this.#readProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        throw new Error("Não encontrado");
      }
      products.splice(index, 1);
      await this.#saveProducts(products);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = ProductManager
