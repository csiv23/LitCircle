const express = require('express');
const router = express.Router();
const {
    getUsers, searchUsers, getUser, registerUser, loginUser, updateUserProfile,
    followUser, unfollowUser, getFollowers, getFollowing, getUserWishlist, addBookToWishlist, getUserClubs, 
    getUserBooksRead, addBookToBooksRead, deleteUser, getUserNextMeetings, signOut, profile,
    removeBookFromWishlist, removeBookFromBooksRead, getUserClubsWithoutBookRec
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:userId', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/signout', signOut)
router.post("/profile", profile);
router.patch('/:userId', updateUserProfile);
router.patch('/:userId/follow', followUser);
router.patch('/:userId/unfollow', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/wishlist', getUserWishlist);
router.post('/:userId/wishlist-delete', removeBookFromWishlist);
router.patch('/:userId/wishlist', addBookToWishlist);
router.get('/:userId/clubs', getUserClubs);
router.get('/:userId/booksread', getUserBooksRead)
router.post('/:userId/booksread-delete', removeBookFromBooksRead);
router.patch('/:userId/booksread', addBookToBooksRead);
router.delete('/:userId', deleteUser);
router.get('/:userId/nextmeetings', getUserNextMeetings);
router.get('/:userId/clubsWithoutRec/:bookId', getUserClubsWithoutBookRec);



module.exports = router;
