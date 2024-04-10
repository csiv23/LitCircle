const Book = require('../models/book');
const Club = require('../models/club');
const User = require('../models/user');

// Fetch and validate a book exists
async function validateBookExists(bookId, res) {
    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404).json({ message: 'Book not found' });
        return null;
    }
    return book;
}

// Fetch and validate a club exists
async function validateClubExists(clubId, res) {
    const club = await Club.findById(clubId);
    if (!club) {
        res.status(404).json({ message: 'Club not found' });
        return null;
    }
    return club;
}

// Fetch and validate a user exists
async function validateUserExists(userId, res) {
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return null;
    }
    return user;
}

module.exports = { validateBookExists, validateClubExists, validateUserExists };
