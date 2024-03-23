import {describe, it, expect, beforeEach, vi} from "vitest";
import CartRepository from "./cart.repository.js";

describe('CartRepository', () => {
  let cartRepository;
  let persistenceMock;

  beforeEach(() => {
    persistenceMock = {
      readItems: vi.fn(),
      saveItems: vi.fn()
    };
    cartRepository = new CartRepository(persistenceMock);
  });

  describe('getCartById', () => {
    it('should return a cart by id', async () => {
      const cart = {id: 1, products: []};
      persistenceMock.readItems.mockResolvedValue([cart]);
      const result = await cartRepository.getCartById(1);
      expect(result).toEqual(cart);
    });

    it('should throw an error when cart is not found', async () => {
      persistenceMock.readItems.mockResolvedValue([]);
      await expect(cartRepository.getCartById(1)).rejects.toThrow('Carrinho não encontrado.');
    });
  });

  describe('addCart', () => {
    it('should add a first cart', async () => {
      const cart = {products: []};
      persistenceMock.readItems.mockResolvedValue([]);
      await cartRepository.addCart(cart);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([{id: 1, products: []}]);
    });
    it('should increment id', async () => {
      const cart = {products: []};
      persistenceMock.readItems.mockResolvedValue([{id: 1, products: []}]);
      await cartRepository.addCart(cart);
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([{id: 1, products: []},{id: 2, products: []}]);
    });
  });

  describe('addProductToCart', () => {
    it('should add a product to a cart', async () => {
      const cart = {id: 1, products: []};
      persistenceMock.readItems.mockResolvedValue([cart]);
      await cartRepository.addProductToCart(1, {product: 1, quantity: 1});
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([{id: 1, products: [{product: 1, quantity: 1}]}]);
    });

    it('should increment quantity when adding the same product', async () => {
      const cart = {id: 1, products: [{product: 1, quantity: 1}]};
      persistenceMock.readItems.mockResolvedValue([cart]);
      await cartRepository.addProductToCart(1, {product: 1, quantity: 2});
      expect(persistenceMock.saveItems).toHaveBeenCalledWith([{id: 1, products: [{product: 1, quantity: 3}]}]);
    });
  });
});
