const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serves your HTML/JS files from the public folder

// --- MongoDB Connection ---
// Using 127.0.0.1 for better reliability in local environments
mongoose.connect('mongodb://127.0.0.1:27017/storefrontDB')
    .then(() => console.log('✅ Server connected to MongoDB: storefrontDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- 1. Products Model (Inventory) ---
const Product = mongoose.model('Product', new mongoose.Schema({
    productId: String,
    description: String,
    category: String,
    unit: String,
    price: Number
}));

// --- 2. ShoppingCart Model ---
const CartItem = mongoose.model('ShoppingCart', new mongoose.Schema({
    productId: String,
    quantity: Number,
    addedAt: { type: Date, default: Date.now }
}));

// --- 3. Shipping Model ---
const Shipping = mongoose.model('Shipping', new mongoose.Schema({
    customerName: String,
    address: String,
    shippingMethod: String,
    timestamp: { type: Date, default: Date.now }
}));

// --- 4. Billing Model ---
const Billing = mongoose.model('Billing', new mongoose.Schema({
    cardHolder: String,
    billingAddress: String,
    amount: Number,
    transactionId: String
}));

// --- 5. Return Model ---
const Return = mongoose.model('Return', new mongoose.Schema({
    productName: String,
    reason: String,
    condition: String,
    timestamp: { type: Date, default: Date.now }
}));

// --- API Routes ---

// GET Products (for your Available Products table)
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// POST to Shopping Cart
app.post('/api/cart', async (req, res) => {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).send({ message: "Added to Cart Collection" });
});

// POST to Shipping
app.post('/api/shipping', async (req, res) => {
    const data = new Shipping(req.body);
    await data.save();
    res.status(201).send({ message: "Shipping Data Saved" });
});

// POST to Billing
app.post('/api/billing', async (req, res) => {
    const data = new Billing(req.body);
    await data.save();
    res.status(201).send({ message: "Billing Data Saved" });
});

// POST to Returns
app.post('/api/returns', async (req, res) => {
    const data = new Return(req.body);
    await data.save();
    res.status(201).send({ message: "Return Data Saved" });
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 Server is live at http://localhost:${PORT}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
});
