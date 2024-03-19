const fs = require('fs');

class CartRepository {
  constructor(path) {
    this.path = path;
  }

  #readCarts = async () => {
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

  #saveCarts = async (carts) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (e) {
      throw e;
    }
  }

  getCartById = async (id) => {
    try {
      const carts = await this.#readCarts();
      const cart = carts.find((cart) => cart.id === id);
      if (!cart) {
        throw new Error("Carrinho não encontrado.");
      }
      return cart;
    } catch (e) {
      throw e;
    }
  }

  addCart = async (cart) => {
    try {
      const carts = await this.#readCarts();
      const lastId = carts[carts.length - 1]?.id ?? 0;
      const newCart = {
        id: lastId + 1,
        products: cart.products?.length > 0 ? cart.products : []
      }
      carts.push(newCart);
      await this.#saveCarts(carts);
    } catch (e) {
      throw e;
    }
  }

  addProductToCart = async (id, product) => {
    try {
      const carts = await this.#readCarts();
      let cIndex;
      const cart = carts.find((cart, i) => {
        cIndex = i;
        return cart.id === id;
      });
      if (!cart) {
        throw new Error("Carrinho não encontrado.");
      }
      let pIndex;
      const existingProduct = cart.products.find((p, i) => {
        pIndex = i;
        return p.product === product.product;
      });
      if (existingProduct) {
        cart.products[pIndex].quantity += product.quantity;
      } else {
        cart.products.push(product);
      }
      carts.splice(cIndex, 1, cart);
      await this.#saveCarts(carts);
    } catch (e) {
      throw e;
    }
  }

}

module.exports = CartRepository;
