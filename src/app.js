const express = require('express');
const cartRouter = require('./routes/cart');
const productRouter = require('./routes/product');

const app = express();

app.use(express.json());

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
