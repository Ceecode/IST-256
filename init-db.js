const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/storefrontDB';

const productSchema = new mongoose.Schema({
    productId: String,
    description: String,
    category: String,
    unit: String,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

const basketballItems = [
    { productId: "1001", description: "Official Game Basketball", category: "Equipment", unit: "Each", price: 59.99 },
    { productId: "1002", description: "Performance Team Jersey", category: "Apparel", unit: "Each", price: 45.00 },
    { productId: "1003", description: "Court Training Cones", category: "Equipment", unit: "Set", price: 25.50 },
    { productId: "1004", description: "Heavy Duty Breakaway Rim", category: "Equipment", unit: "Each", price: 189.00 },
    { productId: "1005", description: "High-Top Court Shoes", category: "Apparel", unit: "Pair", price: 120.00 }
];

async function runSetup() {
    try {
        console.log("📡 PowerShell connecting to MongoDB...");
        await mongoose.connect(dbURI);
        await Product.deleteMany({}); 
        await Product.insertMany(basketballItems);
        console.log("✅ Success! 'storefrontDB' created with basketball items.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

runSetup();