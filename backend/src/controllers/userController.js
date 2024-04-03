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

// Function to register a new user
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
