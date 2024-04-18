const Book = require('../models/book');

const { validateBookExists, validateClubExists, validateUserExists } = require('../utilities/dataValidation');

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

// Fetches and returns a single club by its ID
exports.getBook = async (req, res) => {
    try {
        const book = await validateBookExists(req.params.bookId, res);
        if (!book) {
            // Since validateClubExists sends the response, just return here.
            return;
        }
        res.json(book);
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        res.status(500).json({ error: 'Internal server error while fetching the book by ID.' });
    }
};