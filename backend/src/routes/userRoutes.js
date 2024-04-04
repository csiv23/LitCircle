const express = require('express');
const router = express.Router();
const {
    getUsers, getUser, registerUser, loginUser, updateUserProfile,
    followUser, getFollowers, getUserWishlist, addBookToWishlist
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/:userId', updateUserProfile);
router.patch('/:userId/follow', followUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/wishlist', getUserWishlist);
router.post('/:userId/wishlist', addBookToWishlist);

module.exports = router;
