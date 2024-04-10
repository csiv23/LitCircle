const Book = require('../models/book');

exports.getBooks = async (req, res) => {
    console.log("Fetching books...");
    try {
        const books = await Book.find(); // Example query
        console.log(books); // Log the query result to debug
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send('Server error');
    }
};