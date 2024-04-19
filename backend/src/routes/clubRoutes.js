const Book = require('../models/book');

const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

const {
    getClubs, getClub, createClub, updateClubInfo, joinClub, 
    leaveClub, fetchClubMembers, fetchClubOrganizer, recommendBookForClub, 
    setCurrentBook, markCurrentBookAsRead, deleteClub, addBookToWishlist, deleteBookFromWishlist, 
    setNewMeeting, searchClubs
} = require('../controllers/clubController');

router.get('/', getClubs);
router.get('/search', searchClubs);
router.get('/:clubId', getClub);
router.patch('/:clubId', updateClubInfo);
router.post('/', createClub)
router.post('/:clubId/join', joinClub);
router.post('/:clubId/leave', leaveClub);
router.get('/:clubId/wishlist', clubController.fetchClubAttribute('Wishlist'));
router.get('/:clubId/organizer', fetchClubOrganizer);
router.get('/:clubId/members', fetchClubMembers);
router.get('/:clubId/booksRead', clubController.fetchClubAttribute("BooksRead"));
router.get('/:clubId/currentBook', clubController.fetchClubAttribute('CurrentBook'));
router.get('/:clubId/meeting', clubController.fetchClubAttribute('NextMeeting'));
router.post('/:clubId/recommendBook', recommendBookForClub);
router.post('/:clubId/setCurrentBook', setCurrentBook);
router.post('/:clubId/markCurrentBookAsRead', markCurrentBookAsRead);
router.delete('/:clubId/delete', deleteClub);
router.post('/:clubId/wishlist', addBookToWishlist);
router.delete('/:clubId/wishlist', deleteBookFromWishlist);
router.patch('/:clubId/meeting', setNewMeeting);

module.exports = router;
