const Book = require('../models/book');
const mongoose = require('mongoose');

const { validateBookExists, validateClubExists, validateUserExists, validateBookbyId } = require('../utilities/dataValidation');

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

// Fetches and returns a single book by its Google Books API ID. 
exports.getBook = async (req, res) => {
    try {
        const book = await validateBookbyId(req.params.bookId, res)
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

/**
 * Creates a new book with the given details in the request body.
 * Checks if the book already exists by its GoogleBooksId; if so, returns an error.
 * Validates required fields are present and returns an error if any are missing.
 */
exports.createBook = async (req, res) => {
    const { googleBooksId, title, author, description, coverImageUrl } = req.body;

    // Check for required fields
    if (!googleBooksId || !title || !author || !description) {
        console.error("Missing required field(s).", { providedData: req.body });
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        // Check if the book already exists to prevent duplicates
        const bookExists = await Book.findOne({ GoogleBooksId: googleBooksId });
        if (bookExists) {
            return res.json({ message: "Book already exists.", bookId: bookExists._id });
        }

        // Create a new book object
        const newBook = new Book({
            GoogleBooksId: googleBooksId,
            Title: title,
            Author: author,
            Description: description,
            CoverImageUrl: coverImageUrl,
            ClubsReading: []
        });

        // Save the new book to the database
        await newBook.save();

        res.json({ message: "Book created successfully", bookId: newBook._id });
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).json({ error: "Internal server error while creating a new book." });
    }
};
