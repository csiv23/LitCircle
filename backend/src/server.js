require('dotenv').config();
const session = require('express-session');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from .env file
const connectToMongoDB = require('./database/dbConnect'); // Require the database module
const userRoutes = require('./routes/userRoutes');
const clubRoutes = require('./routes/clubRoutes');
const bookRoutes = require('./routes/bookRoutes');

const server = express();

// Connect to MongoDB
connectToMongoDB();

// Middleware
server.use(cors());
server.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_ORIGIN // Adjust the port and protocol to match your frontend
}));
// Multiple user sessions:
const sessionOptions = {
  secret: "secret_session", // process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: "http://localhost:4000" // process.env.HTTP_SERVER_DOMAIN,
  };
}
server.use(session(sessionOptions));
server.use(express.json()); // for parsing application/json

// Test route
server.get('/', (req, res) => {
  res.send('Hello, LitCircle API!');
});

// Use user routes
server.use('/api/users', userRoutes);

// Use club routes
server.use('/api/clubs', clubRoutes);

// Use book routes
server.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

