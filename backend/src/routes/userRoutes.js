const express = require('express');
const router = express.Router();
const {
    getUsers, getUser, registerUser, loginUser, updateUserProfile,
    followUser, getFollowers, getUserWishlist, addBookToWishlist, getUserClubs, getUserBooksRead, addBookToBooksRead, profile
    getFollowing, deleteUser, getUserNextMeetings
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/profile", profile);
router.patch('/:userId', updateUserProfile);
router.patch('/:userId/follow', followUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/wishlist', getUserWishlist);
router.patch('/:userId/wishlist', addBookToWishlist);
router.get('/:userId/clubs', getUserClubs);
router.get('/:userId/booksread', getUserBooksRead)
router.patch('/:userId/booksread', addBookToBooksRead);
router.delete('/:userId', deleteUser);
router.get('/:userId/nextmeetings', getUserNextMeetings);

module.exports = router;
