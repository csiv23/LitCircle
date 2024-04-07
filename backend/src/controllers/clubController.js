const Club = require('../models/club');
const User = require('../models/user');

/**
 * Validates the existence of a club and then executes a provided operation.
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Function} operationCallback - The callback function to execute which includes the operation logic.
 */
const validateClubExistsAndExecute = async (req, res, operationCallback) => {
    const { clubId } = req.params;
    try {
        // Directly using the callback with the found club to avoid refetching
        const club = await Club.findById(clubId).populate('Members', 'Username Email').populate('Organizer', 'Username Email');
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        await operationCallback(club, req, res);
    } catch (error) {
        console.error("Error in club operation:", error);
        res.status(500).send('Server error');
    }
};

// Fetches and returns all clubs
exports.getClubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        res.json(clubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).send('Server error');
    }
};

// Fetches and returns a single club by its ID
exports.getClub = (req, res) => {
    validateClubExistsAndExecute(req, res, async (club) => {
        res.json(club);
    });
};

/**
 * Creates a new club with the given details in the request body.
 * It checks if the organizer exists before creating the club.
 */
exports.createClub = async (req, res) => {
    const { Name, Description, Organizer } = req.body;

    try {
        const organizer = await User.findById(Organizer);
        if (!organizer) {
            return res.status(404).json({ msg: 'Organizer not found' });
        }

        const newClub = new Club({
            Name,
            Description,
            Members: [Organizer], // Initial member is the organizer
            BooksRead: [],
            Wishlist: [],
            CurrentBook: null,
            Organizer,
        });

        await newClub.save();
        organizer.BookClubs.push({ ClubId: newClub._id, IsLeader: true, JoinDate: new Date() });
        await organizer.save();

        res.json({ message: "Club created successfully", clubID: newClub.id });
    } catch (error) {
        console.error("Error creating new club:", error);
        res.status(500).send('Server error');
    }
};

/**
 * Updates the specified club's information based on the data provided in the request body.
 */
exports.updateClubInfo = (req, res) => {
    const updateData = req.body;

    validateClubExistsAndExecute(req, res, async (club) => {
        if (updateData.Organizer) {
            const organizer = await User.findById(updateData.Organizer);
            if (!organizer) {
                return res.status(404).json({ message: 'Organizer not found' });
            }
        }

        // Apply updates without refetching
        Object.assign(club, updateData);
        await club.save();
        res.json({ message: 'Club updated successfully', club });
    });
};

/**
 * Adds a user to a club's member list based on the user ID provided in the request body.
 */
exports.joinClub = (req, res) => {
    const { userId } = req.body;

    validateClubExistsAndExecute(req, res, async (club) => {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check and update without unnecessary refetching
        if (club.Members.map(member => member._id.toString()).includes(userId)) {
            return res.status(400).json({ message: 'User already a member of the club' });
        }

        club.Members.push(userId);
        await club.save();

        user.BookClubs.push({ ClubId: club._id, IsLeader: false, JoinDate: new Date() });
        await user.save();

        res.json({ message: 'User added to club successfully', club });
    });
};

/**
 * Removes a user from a club's member list based on the user ID provided in the request body.
 */
exports.leaveClub = (req, res) => {
    const { userId } = req.body;

    validateClubExistsAndExecute(req, res, async (club) => {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the user without refetching the club
        club.Members = club.Members.filter(member => member._id.toString() !== userId);
        await club.save();

        user.BookClubs = user.BookClubs.filter(bookClub => bookClub.ClubId.toString() !== club._id.toString());
        await user.save();

        res.json({ message: 'User removed from club successfully' });
    });
};

/**
 * A specialized function for fetching members of a club with detailed user information.
 * This function is now simplified as refetching is handled in validateClubExistsAndExecute.
 */
exports.fetchClubMembers = (req, res) => {
    validateClubExistsAndExecute(req, res, async (club) => {
        // Directly return the already populated Members
        if (club.Members.length === 0) {
            return res.status(404).json({ message: 'Members not found' });
        }
        res.json({ Members: club.Members });
    });
};

/**
 * Fetches the organizer of a club with detailed user information.
 * Eliminates the need for refetching by utilizing validateClubExistsAndExecute for population.
 */
exports.fetchClubOrganizer = (req, res) => {
    validateClubExistsAndExecute(req, res, async (club) => {
        // Directly return the already populated Organizer
        if (!club.Organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }
        res.json({ Organizer: club.Organizer });
    });
};

exports.fetchClubAttribute = (attributeName) => {
    return (req, res) => {
        validateClubExistsAndExecute(req, res, async (club) => {
            // Populate the specified attributeName and directly await the result
            club = await Club.findById(club._id).populate(attributeName);
            if (!club[attributeName]) {
                return res.status(404).json({ message: `${attributeName} not found` });
            }
            // Since populate returns a promise, you can await it directly
            // and then use the populated club document
            res.json({ [attributeName]: club[attributeName] });
        });
    };
};

