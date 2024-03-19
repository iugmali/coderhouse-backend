class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  getProducts = async () => {
    try {
      return await this.productRepository.getProducts();
    } catch (e) {
      throw e;
    }
  };

  addProduct = async (product) => {
    try {
      await this.productRepository.addProduct(product);
    } catch (e) {
      throw e;
    }
  };

  getProduct = async (id) => {
    try {
      return await this.productRepository.getProductById(id);
    } catch (e) {
      throw e;
    }
  };

  updateProduct = async (id, product) => {
    try {
      await this.productRepository.updateProduct(id, product);
    } catch (e) {
      throw e;
    }
  };

  deleteProduct = async (id) => {
    try {
      await this.productRepository.deleteProduct(id);
    } catch (e) {
      throw e;
    }
  };
}

module.exports = ProductController;
