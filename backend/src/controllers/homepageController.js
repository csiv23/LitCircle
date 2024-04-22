const Club = require('../models/club');
const User = require('../models/user');
const Book = require('../models/book');

exports.getRecentUsers = async (req, res) => {
    try {
        // Find users, sort them by JoinDate in descending order, and limit results to 5
        const recentUsers = await User.find().sort({ JoinDate: -1 }).limit(5);
        res.json(recentUsers);
    } catch (error) {
        // Log and return error if the query fails
        console.error("Error fetching recent users:", error);
        res.status(500).json({ error: 'Internal server error while fetching recent users.' });
    }
};

// Handler for fetching the last five followers of a specific user.
exports.getNewFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID, retrieve only the last 5 followers
        const user = await User.findById(userId, {
            Followers: { $slice: -5 }  // Retrieves only the last 5 items from the Followers array
        }).populate({
            path: 'Followers', // Populate the Followers field to return user documents
            select: 'Username Email' // Limit the fields to include only Username and Email
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If successful, send back the populated Followers array in the response.
        res.json(user.Followers);
    } catch (error) {
        console.error("Error getting last five followers:", error);
        res.status(500).send('Server error');
    }
};


