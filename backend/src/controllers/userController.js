const User = require('../models/user');
const Book = require('../models/book');


exports.getUsers = async (req, res) => {
    console.log("Fetching users...");
    try {
        const users = await User.find(); // Example query
        console.log(users); // Log the query result to debug
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send('Server error');
    }
};

exports.getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Server error');
    }
};

// Function to register a new user
// TODO: Implement w/ FireBase
exports.registerUser = async (req, res) => {
    const { Username, Password, Email, role, uid } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ Email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            Username,
            Password,
            Email,
            role,
            uid
        });

        await user.save();

        // Respond with the new user's ID
        res.json({ userID: user.id });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send('Server error');
    }
};

// TODO: implement using FireBase
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("userController.js loginUser email: " + email);
    console.log("userController.js loginUser password: " + password);
    try {
        // TODO: Hash password????
        const user = await User.findOne({ Email: email, Password: password });
        console.log("User.findOne(): " + user);
        if (!user) {
            return res.status(400).json({ msg: 'User login does not exist' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send('Server error');
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { Username: name, Email: email }},
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send('Server error');
    }
};

// Follow another user
exports.followUser = async (req, res) => {
    const { userId } = req.params; // Follower
    const { userIdToFollow } = req.body; // Followed

    try {
        // Add userIdToFollow to the Following array of the follower
        await User.findByIdAndUpdate(
            userId,
            { $push: { Following: userIdToFollow }},
            { new: true }
        );
        // Add userId to the Followers array of the followed user
        await User.findByIdAndUpdate(
            userIdToFollow,
            { $push: { Followers: userId }},
            { new: true }
        );
        res.status(204).send();
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).send('Server error');
    }
};

// Handler for fetching the list of followers of a specific user.
exports.getFollowers = async (req, res) => {
    // Extract the userId from the request parameters.
    const { userId } = req.params;

    try {
        // Use the findById method to locate the user by their ID and populate the Followers field.
        // This effectively dereferences the user IDs in the Followers array to return full user documents.
        const user = await User.findById(userId).populate('Followers');
        
        // If successful, send back the populated Followers array in the response.
        res.json(user.Followers);
    } catch (error) {
        // Log any errors encountered during the operation.
        console.error("Error getting followers:", error);
        
        // Send a 500 Internal Server Error status code and message if an error occurs.
        res.status(500).send('Server error');
    }
};

exports.getUserWishlist = async (req, res) => {
    const { userId } = req.params; // Extract the userId from the URL parameter

    try {
        // Find the user by their ID
        const user = await User.findById(userId).populate('Wishlist'); // Assuming 'Wishlist' is a reference to a collection of Book documents

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Respond with the user's wishlist
        // This will be an array of book documents that are in the user's wishlist
        res.json(user.Wishlist);
    } catch (error) {
        console.error("Error fetching user's wishlist:", error);
        res.status(500).send('Server error');
    }
};

exports.addBookToWishlist = async (req, res) => {
    const { userId } = req.params; // Extract userId from URL parameters
    const { bookId } = req.body; // Extract bookId from request body

    try {
        // Find the user by ID and update their wishlist
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { Wishlist: bookId } }, // Use $addToSet to avoid duplicate entries
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error adding book to wishlist:", error);
        res.status(500).send('Server error');
    }
};

exports.getUserClubs = async (req, res) => {
    const { userId } = req.params;

    try {
        // Note the corrected path for populate to match the provided schema
        const user = await User.findById(userId).populate({
            path: 'BookClubs.ClubId',
            model: 'Club' // Ensure this matches the model name used in your Club schema
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Extract the ClubId for each club the user is a part of
        const clubs = user.BookClubs.map(bookClub => bookClub.ClubId);
        res.json(clubs);
    } catch (error) {
        console.error("Error fetching user's clubs:", error);
        res.status(500).send('Server error');
    }
};

exports.getUserBooksRead = async (req, res) => {
    const { userId } = req.params; // Extract the userId from the URL parameter

    try {
        // Find the user by their ID
        const user = await User.findById(userId).populate('BooksRead'); 

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Respond with the user's wishlist
        // This will be an array of book documents that are in the user's wishlist
        res.json(user.BooksRead);
    } catch (error) {
        console.error("Error fetching user's books read:", error);
        res.status(500).send('Server error');
    }
};

exports.addBookToBooksRead = async (req, res) => {
    const { userId } = req.params;
    const { bookId } = req.body; // Assuming the ID of the book to add is sent in the request body

    try {
        // Find the user by ID and update their "BooksRead" array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { BooksRead: bookId } }, // Use $addToSet to prevent duplicates
            { new: true, runValidators: true } // Return the updated document and ensure validators run
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        // Respond with the updated user information
        res.json(updatedUser);
    } catch (error) {
        console.error("Error adding book to user's BooksRead:", error);
        res.status(500).send('Server error');
    }
};