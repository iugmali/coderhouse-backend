class CartController {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  getCart = async (id) => {
    try {
      return await this.cartRepository.getCartById(id);
    } catch (e) {
      throw e;
    }
  };

  addCart = async (cart) => {
    try {
      await this.cartRepository.addCart(cart);
    } catch (e) {
      throw e;
    }
  };

  addProductToCart = async (id, product) => {
    try {
      await this.cartRepository.addProductToCart(id, product);
    } catch (e) {
      throw e;
    }
  };
}

export default CartController;
