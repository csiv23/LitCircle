const express = require('express');
const router = express.Router();

const {
    getBooks,
    getBook
} = require('../controllers/bookController');

router.get('/', getBooks);
router.get('/:bookId', getBook);

module.exports = router;
