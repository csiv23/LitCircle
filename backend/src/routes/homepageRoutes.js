const express = require('express');
const router = express.Router();
const { getRecentUsers } = require('../controllers/homepageController');

router.get('/recentUsers', getRecentUsers);

module.exports = router;
