const express = require('express');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from .env file
const connectToMongoDB = require('./database/dbConnect'); // Require the database module
const userRoutes = require('./routes/userRoutes');
const clubRoutes = require('./routes/clubRoutes');


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

// Use user routes
server.use('/api/users', userRoutes);

// Use club routes
server.use('/api/clubs', clubRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
