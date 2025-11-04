const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/product-catalog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Define a Product schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageUrl: String,
});

const Product = mongoose.model('Product', productSchema);

// CRUD Routes

// Create a new product
app.post('/api/products', async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, imageUrl });
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, description, price, imageUrl }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
