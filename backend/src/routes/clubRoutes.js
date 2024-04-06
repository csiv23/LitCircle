const express = require('express');
const router = express.Router();

const {
    getClubs, getClub, createClub, updateClubInfo, joinClub, leaveClub
} = require('../controllers/clubController');

router.get('/', getClubs);
router.get('/:clubId', getClub);
router.patch('/:clubId', updateClubInfo);
router.post('/', createClub)
router.post('/:clubId/join', joinClub);
router.post('/:clubId/leave', leaveClub);

module.exports = router;
