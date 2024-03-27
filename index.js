const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());


const products = [
  { id: uuidv4(), name: 'Product 1', rating: 4.5, price: 50, company: 'Company A', discount: 0 },
  { id: uuidv4(), name: 'Product 2', rating: 4.0, price: 40, company: 'Company B', discount: 10 },
  { id: uuidv4(), name: 'Product 3', rating: 4.8, price: 60, company: 'Company C', discount: 5 },
  
];

// GET /categories/:categoryname/products
app.get('/categories/:categoryname/products', (req, res) => {
  const categoryName = req.params.categoryname;
  let n = parseInt(req.query.n) || 10;
  const page = parseInt(req.query.page) || 1;
  const sortBy = req.query.sortBy || 'rating';
  const sortOrder = req.query.sortOrder || 'desc';

  // validate n to be at most 10
  n = Math.min(n, 10);

  // calculate pagination
  const startIndex = (page - 1) * n;
  const endIndex = page * n;

  // sort products based on order
  let sortedProducts = [...products];
  sortedProducts.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] - b[sortBy];
    } else {
      return b[sortBy] - a[sortBy];
    }
  });

  // paginate the sorted products
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  res.json(paginatedProducts.map(product => ({ id: product.id, name: product.name })));
});

// GET /categories/:categoryname/products/:productid
app.get('/categories/:categoryname/products/:productid', (req, res) => {
  const productId = req.params.productid;
  const product = products.find(prod => prod.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
