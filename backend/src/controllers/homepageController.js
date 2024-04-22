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