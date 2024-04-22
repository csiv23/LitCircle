const express = require('express');
const router = express.Router();
const { getRecentUsers } = require('../controllers/homepageController');
const { getUserNextMeetings} = require('../controllers/userController');

router.get('/data', getRecentUsers);
router.get('/:userId/nextmeetings', getUserNextMeetings); 


module.exports = router;
