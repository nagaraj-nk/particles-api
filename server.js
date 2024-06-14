const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

// Path to the JSON file
const filePath = "products.json";
app.use(bodyParser.json());

// Function to read products from the JSON file
function readProductsFromFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log("data", data);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Function to write products to the JSON file
function writeProductsToFile(products) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

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
  console.log("newProduct", newProduct);
  const products = readProductsFromFile();
  console.log("products", products);
  products.push(newProduct);
  console.log(products);
  writeProductsToFile(products);
  res.status(201).json(newProduct);
});

// PUT update a product by ID
app.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
