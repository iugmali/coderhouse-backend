import {describe, it, expect, beforeEach, vi} from "vitest";
import ProductRepository from "./product.repository.js";

describe('ProductRepository', () => {
  let productRepository;
  let persistenceMock;
  let sampleProduct;
  let sampleProducts;

  beforeEach(() => {
    persistenceMock = {
      readItems: vi.fn(),
      saveItems: vi.fn()
    };
    productRepository = new ProductRepository(persistenceMock);
    sampleProduct = {id: 1, title: 'Product 1', price: 10, description: 'Description', code: 'P1', status: true, stock: 10, category: 'Category', thumbnails: []};
    sampleProducts = [
      {id: 1, title: 'Product 1', price: 10, description: 'Description', code: 'P1', status: true, stock: 10, category: 'Category', thumbnails: []},
      {id: 2, title: 'Product 2', price: 20, description: 'Description', code: 'P2', status: true, stock: 20, category: 'Category', thumbnails: []}
    ];
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      const result = await productRepository.getProducts();
      expect(result).toEqual(sampleProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      const result = await productRepository.getProductById(1);
      expect(result).toEqual(sampleProduct);
    });

    it('should throw an error when product is not found', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await expect(productRepository.getProductById(1)).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('addProduct', () => {
    it('should add a product', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await productRepository.addProduct(sampleProduct);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([sampleProduct]);
    });

    it('should increment id', async () => {
      const product = {
        title: 'Product 3',
        price: 10,
        description: 'Description',
        code: 'P3',
        status: true,
        stock: 10,
        category: 'Category'
      };
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      await productRepository.addProduct(product);
      await expect(productRepository.getProductById(3)).resolves.toEqual({...product, id: 3, thumbnails: []});
    });
    it('should throw an error when product is invalid', async () => {
      const product = {
        title: '',
        price: 10,
        description: 'Description',
        code: 'P3',
        status: true,
        stock: 10,
        category: 'Category'
      };
      await expect(productRepository.addProduct(product)).rejects.toThrow('Produto inválido.');
    });
    it('should throw an error when code already exists', async () => {
      const product = {
        title: 'Product 3',
        price: 10,
        description: 'Description',
        code: 'P1',
        status: true,
        stock: 10,
        category: 'Category'
      };
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      await expect(productRepository.addProduct(product)).rejects.toThrow('Código já existe.');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const product = {
        title: 'updated Product 1',
      };
      persistenceMock.readItems.mockResolvedValue([sampleProduct]);
      await productRepository.updateProduct(1, product);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([{...sampleProduct, ...product}]);
    });
    it('should throw an error when code already exists', async () => {
      const product = {
        code: 'P2'
      };
      persistenceMock.readItems.mockResolvedValue(sampleProducts);
      await expect(productRepository.updateProduct(1, product)).rejects.toThrow('Código já existe.');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      persistenceMock.readItems.mockResolvedValue([sampleProduct]);
      await productRepository.deleteProduct(1);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([]);
    });

    it('should throw an error when product is not found', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await expect(productRepository.deleteProduct(1)).rejects.toThrow('Produto não encontrado.');
    });
  });

});
