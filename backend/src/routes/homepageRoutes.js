const express = require('express');
const router = express.Router();
const { getRecentUsers, getNewFollowers } = require('../controllers/homepageController');
const { getUserNextMeetings} = require('../controllers/userController');

router.get('/data', getRecentUsers);
router.get('/:userId/nextmeetings', getUserNextMeetings); 
router.get('/:userId/newfollowers', getNewFollowers);

module.exports = router;
