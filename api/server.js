const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); 

const walletRoutes = require('./routes/wallet');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));


