const bcrypt = require('bcrypt'); // If you're using bcrypt

const User = require('../models/user');

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
    const { Username, Password, Email, role } = req.body;

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
            role
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
    const { Email, Password } = req.body;

    try {
        let user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ msg: 'User email does not exist' });
        }

        // Directly compare plaintext passwords
        // TODO: Hash(?)
        if (Password !== user.Password) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        res.json({ userID: user.id });
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
