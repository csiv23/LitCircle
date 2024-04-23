const session = require('express-session');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from .env file
const connectToMongoDB = require('./database/dbConnect'); // Require the database module
const userRoutes = require('./routes/userRoutes');
const clubRoutes = require('./routes/clubRoutes');
const bookRoutes = require('./routes/bookRoutes');
const homepageRoutes = require('./routes/homepageRoutes');

const server = express();
// Connect to MongoDB
connectToMongoDB();

const { createProxyMiddleware } = require('http-proxy-middleware');
// Middleware
  server.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL, // Adjust the port and protocol to match your frontend
  }));

// Multiple user sessions:
const sessionOptions = {
  secret: process.env.SESSION_SECRET, // process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.HTTP_SERVER_DOMAIN,
  };
}
server.use(session(sessionOptions));
server.use(express.json()); // for parsing application/json
server.use('/google-books-api', createProxyMiddleware({
  target: 'https://www.googleapis.com', // Base URL for Google Books API
  changeOrigin: true,
  // pathRewrite: {
  //   '^/google-books-api': '', // Rewrite paths from /api to /
  // },
}));
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

// Use homepage routes
server.use('/api/homepage', homepageRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(process.env.FRONTEND_URL);
});

