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