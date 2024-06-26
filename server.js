const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

// Path to the JSON file
const filePath = "products.json";
app.use(bodyParser.json());
app.use(cors());

const imageIcon =
  "https://www.pngitem.com/pimgs/m/568-5680053_prod-placeholder-vector-product-icon-png-transparent-png.png";
// Function to read products from the JSON file
function readProductsFromFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Function to write products to the JSON file
function writeProductsToFile(products) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

// GET status
app.get("/", (req, res) => {
  var ok = { status: "ok" };
  res.json(ok);
});

// GET all products
app.get("/products", (req, res) => {
  const products = readProductsFromFile();
  res.json(products);
});

// GET a product by ID
app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const products = readProductsFromFile();
  const product = products.find((product) => product.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found");
  }
});

// POST a new product
app.post("/products", (req, res) => {
  const newProduct = req.body;
  const products = readProductsFromFile();
  productId = 1;
  console.log("products.length", products.length);
  if (products.length > 0) {
    productId = products[products.length - 1].id + 1;
    newProduct.id = productId;
    console.log("newProduct inside", newProduct);
  }
  console.log("newProduct", newProduct);
  console.log("products", products);
  newProduct.image = imageIcon;
  products.push(newProduct);
  console.log(products);
  writeProductsToFile(products);
  res.status(201).json(newProduct);
});

// PUT update a product by ID
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  updatedProduct.image = imageIcon;
  let products = readProductsFromFile();
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    writeProductsToFile(products);
    res.json(products[index]);
  } else {
    res.status(404).send("Product not found");
  }
});

// DELETE a product by ID
app.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  let products = readProductsFromFile();
  const index = products.findIndex((product) => product.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    writeProductsToFile(products);
    res.status(204).send();
  } else {
    res.status(404).send("Product not found");
  }
});

// GET all unique brands
app.get("/products/brands", (req, res) => {
  const products = readProductsFromFile();
  // Extract unique brands
  const brands = [...new Set(products.map(product => product.brand))];
  res.json(brands);
});

// GET products by brand
app.get("/products/brand/:brand", (req, res) => {
  const brand = req.params.brand.toLowerCase();
  const products = readProductsFromFile();
  const filteredProducts = products.filter(product => product.brand.toLowerCase() === brand);
  res.json(filteredProducts);
});

// GET products by price range
app.get("/products/price", (req, res) => {
  const minPrice = parseFloat(req.query.min) || 0;
  const maxPrice = parseFloat(req.query.max) || Number.MAX_SAFE_INTEGER;
  const products = readProductsFromFile();
  const filteredProducts = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  res.json(filteredProducts);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
