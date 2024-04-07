const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');


const {
    getClubs, getClub, createClub, updateClubInfo, joinClub, leaveClub, fetchClubMembers, fetchClubOrganizer
} = require('../controllers/clubController');

router.get('/', getClubs);
router.get('/:clubId', getClub);
router.patch('/:clubId', updateClubInfo);
router.post('/', createClub)
router.post('/:clubId/join', joinClub);
router.post('/:clubId/leave', leaveClub);
router.get('/:clubId/wishlist', clubController.fetchClubAttribute('Wishlist'));
router.get('/:clubId/organizer', fetchClubOrganizer);
router.get('/:clubId/members', fetchClubMembers);
router.get('/:clubId/booksRead', clubController.fetchClubAttribute('BooksRead'));
router.get('/:clubId/currentBook', clubController.fetchClubAttribute('CurrentBook'));
router.get('/:clubId/nextMeeting', clubController.fetchClubAttribute('NextMeeting'));

module.exports = router;
