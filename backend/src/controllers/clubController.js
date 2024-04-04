const Club = require('../models/club');

exports.getClubs = async (req, res) => {
    console.log("Fetching users...");
    try {
        const clubs = await Club.find(); // Example query
        console.log(clubs); // Log the query result to debug
        res.json(clubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).send('Server error');
    }
};