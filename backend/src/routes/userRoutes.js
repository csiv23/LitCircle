const express = require('express');
const router = express.Router();
const {
    getUsers, getUser, registerUser, loginUser, updateUserProfile,
    followUser, getFollowers, getUserWishlist
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/:userId', updateUserProfile);
router.patch('/:userId/follow', followUser);
router.get('/:userId/followers', getFollowers);

module.exports = router;
