const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Frontend ని సర్వ్ చేయడం
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
// Temporary Route to add 20 products via browser
app.get('/add-products', async (req, res) => {
  try {
    const Product = require('./models/Product');
    await Product.deleteMany({});

    const products = [
      { name: "iPhone 15 Pro", price: 129999, description: "Titanium design, A17 Pro chip", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", category: "Electronics" },
      { name: "Sony WH-1000XM5", price: 29999, description: "Noise cancellation headphones", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500", category: "Audio" },
      { name: "MacBook Air M3", price: 114999, description: "Supercharged by M3 chip", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", category: "Laptops" },
      { name: "Nike Air Max", price: 8999, description: "Comfortable running shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "Fashion" },
      { name: "Apple Watch Series 9", price: 41999, description: "Advanced health tracking", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500", category: "Wearables" },
      { name: "Canon EOS R50", price: 68999, description: "Mirrorless camera 4K video", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500", category: "Cameras" },
      { name: "Samsung Galaxy S24", price: 79999, description: "AI-powered flagship phone", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", category: "Electronics" },
      { name: "Dell XPS 15", price: 149999, description: "Premium Windows laptop", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500", category: "Laptops" },
      { name: "Bose QuietComfort", price: 24999, description: "Premium noise-cancelling", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500", category: "Audio" },
      { name: "Adidas Ultraboost", price: 12999, description: "High-performance running shoes", image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500", category: "Fashion" },
      { name: "iPad Pro 12.9", price: 99999, description: "Powerful tablet for creators", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500", category: "Tablets" },
      { name: "Logitech MX Master 3", price: 8999, description: "Advanced wireless mouse", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", category: "Accessories" },
      { name: "Sony PlayStation 5", price: 49999, description: "Next-gen gaming console", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500", category: "Gaming" },
      { name: "Kindle Paperwhite", price: 13999, description: "Waterproof e-reader", image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500", category: "Electronics" },
      { name: "Dyson V15 Vacuum", price: 52999, description: "Powerful cordless vacuum", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500", category: "Home" },
      { name: "Levi's Denim Jacket", price: 4999, description: "Classic denim jacket", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500", category: "Fashion" },
      { name: "GoPro Hero 12", price: 39999, description: "Action camera for adventures", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500", category: "Cameras" },
      { name: "Mechanical Keyboard", price: 7499, description: "RGB backlit gaming keyboard", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500", category: "Accessories" },
      { name: "Ray-Ban Sunglasses", price: 8999, description: "Classic aviator sunglasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", category: "Fashion" },
      { name: "Nespresso Coffee Machine", price: 19999, description: "Premium coffee maker", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500", category: "Home" }
    ];

    await Product.insertMany(products);
    res.send("20 Products added successfully! Go to http://localhost:5000");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});
// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ MongoDB Connection Error: ', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});