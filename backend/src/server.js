const express = require('express');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from .env file
const connectToMongoDB = require('./dbConnect'); // Require the database module

const server = express();

// Connect to MongoDB
connectToMongoDB();

// Middleware
server.use(cors());
server.use(express.json()); // for parsing application/json

// Test route
server.get('/', (req, res) => {
  res.send('Hello, LitCircle API!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
