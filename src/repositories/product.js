const fs = require("fs");

class ProductRepository {
  constructor(path) {
    this.path = path;
  }

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

  getProducts = async () => {
    try {
      return await this.#readProducts();
    } catch (e) {
      throw e;
    }
  };

  addProduct = async ({title, description, code, price, status, stock, category, thumbnails = []}) => {
    try {
      if (!title || title.trim() === "" || !description || description.trim() === "" || !code || code.trim() === "" || !price || price <= 0 || !stock || stock <= 0 || !category || category.trim() === "") {
        throw new Error("Produto inválido.");
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
        code,
        price,
        status,
        stock,
        category,
        thumbnails
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
        code: (!enteredProduct?.code?.trim()) ? product.code : enteredProduct.code,
        price: (!enteredProduct?.price) ? product.price : (enteredProduct.price <= 0) ? product.price : enteredProduct.price,
        status: (!enteredProduct?.status) ? product.status : enteredProduct.status,
        stock: (!enteredProduct?.stock) ? product.stock : (enteredProduct.stock <= 0) ? product.stock : enteredProduct.stock,
        category: (!enteredProduct?.category?.trim()) ? product.category : enteredProduct.category,
        thumbnails: (enteredProduct?.thumbnails?.length > 0) ? enteredProduct.thumbnails : product.thumbnails,
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

module.exports = ProductRepository;
