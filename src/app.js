const express = require('express');
const ProductManager = require('./ProductManager');

const productManager = new ProductManager(__dirname + '/data/products.json');

const app = express();

app.get('/products', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const {limit} = req.query;
    if (limit) {
      res.json(products.slice(0, limit));
      return;
    }
    res.json(products);
  } catch (e) {
  res.status(404).send('Produtos não encontrados');
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(+req.params.pid);
    res.json(product);
  } catch (e) {
    res.status(404).send('Produto não encontrado');
  }
});

app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});
