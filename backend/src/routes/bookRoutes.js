const express = require('express');
const router = express.Router();

const {
    getBooks,
    getBook,
    createBook,
} = require('../controllers/bookController');

const bookController = require('../controllers/bookController');

router.get('/', getBooks);
router.get('/:bookId', getBook);
router.get('/:bookId/clubsReading', bookController.fetchBookAttribute('ClubsReading'));
router.post('/', createBook);


module.exports = router;
