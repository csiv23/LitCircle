const Club = require('../models/club');
const User = require('../models/user');
const Book = require('../models/book');

const { validateBookExists, validateClubExists, validateUserExists } = require('../utilities/dataValidation');

// Fetches and returns all clubs
exports.getClubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        res.json(clubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).send('Internal server error while creating a new club');
    }
};

// Fetches and returns a single club by its ID
exports.getClub = async (req, res) => {
    const club = await validateClubExists(req.params.clubId, res);
    if (club) {
        res.json(club);
    }
};

/**
 * Creates a new club with the given details in the request body.
 * It checks if the organizer exists before creating the club.
 */
exports.createClub = async (req, res) => {
    const { Name, Description, Organizer } = req.body;

    try {
        const organizer = await validateUserExists(Organizer, res);
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
exports.updateClubInfo = async (req, res) => {
    const club = await validateClubExists(req.params.clubId, res);
    if (!club) return;

    const updateData = req.body;
    if (updateData.Organizer) {
        const organizer = await validateUserExists(updateData.Organizer, res);
        if (!organizer) return;
    }

    // Apply updates without refetching
    Object.assign(club, updateData);
    await club.save();
    res.json({ message: 'Club updated successfully', club });
};

/**
 * Adds a user to a club's member list based on the user ID provided in the request body.
 */
exports.joinClub = async (req, res) => {
    const club = await validateClubExists(req.params.clubId, res);
    if (!club) return;

    const user = await validateUserExists(req.body.userId, res);
    if (!user) return;

    // Check and update without unnecessary refetching
    if (club.Members.map(member => member._id.toString()).includes(req.body.userId)) {
        return res.status(400).json({ message: 'User already a member of the club' });
    }

    club.Members.push(req.body.userId);
    await club.save();

    user.BookClubs.push({ ClubId: club._id, IsLeader: false, JoinDate: new Date() });
    await user.save();

    res.json({ message: 'User added to club successfully', club });
};

/**
 * Removes a user from a club's member list based on the user ID provided in the request body.
 */
exports.leaveClub = async (req, res) => {
    const club = await validateClubExists(req.params.clubId, res);
    if (!club) return;

    const user = await validateUserExists(req.body.userId, res);
    if (!user) return;

    // Remove the user without refetching the club
    club.Members = club.Members.filter(member => member._id.toString() !== req.body.userId);
    await club.save();

    user.BookClubs = user.BookClubs.filter(bookClub => bookClub.ClubId.toString() !== club._id.toString());
    await user.save();

    res.json({ message: 'User removed from club successfully' });
};

/**
 * A specialized function for fetching members of a club with detailed user information.
 * This function is now simplified as refetching is handled in validateClubExistsAndExecute.
 */
exports.fetchClubMembers = async (req, res) => {
    const clubId = req.params.clubId;
    try {
        // Find the club by ID and populate the Members field
        const clubWithMembers = await Club.findById(clubId).populate('Members');
        if (!clubWithMembers) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (!clubWithMembers.Members || clubWithMembers.Members.length === 0) {
            return res.status(404).json({ message: 'Members not found' });
        }
        res.json({ Members: clubWithMembers.Members });
    } catch (error) {
        console.error("Error fetching club members:", error);
        res.status(500).send('Server error');
    }
};

/**
 * Fetches the organizer of a club with detailed user information.
 */
exports.fetchClubOrganizer = async (req, res) => {
    const clubId = req.params.clubId;
    try {
        // Find the club by ID and populate the Organizer field
        const clubWithOrganizer = await Club.findById(clubId).populate('Organizer');
        if (!clubWithOrganizer) {
            return res.status(404).json({ message: 'Club not found' });
        }
        if (!clubWithOrganizer.Organizer) {
            // This check might be redundant if Organizer is required, but it's good for safety
            return res.status(404).json({ message: 'Organizer not found' });
        }
        res.json({ Organizer: clubWithOrganizer.Organizer });
    } catch (error) {
        console.error("Error fetching club organizer:", error);
        res.status(500).send('Server error');
    }
};

exports.fetchClubAttribute = (attributeName) => {
    return async (req, res) => {
        const club = await validateClubExists(req.params.clubId, res);
        if (!club) return; // validateClubExists will handle the response if the club doesn't exist

        try {
            const populatedClub = await Club.findById(club._id).populate(attributeName);
            if (!populatedClub || !populatedClub[attributeName]) {
                return res.status(404).json({ message: `${attributeName} not found` });
            }
            // Since populate returns a promise, you can await it directly
            // and then use the populated club document
            res.json({ [attributeName]: populatedClub[attributeName] });
        } catch (error) {
            console.error(`Error fetching ${attributeName}:`, error);
            res.status(500).send('Server error');
        }
    };
};

/**
 * Adds a recommended book to the club's wishlist.
 * @param {Object} req - The request object, including the bookID to be added to the wishlist and the clubId as a URL parameter.
 * @param {Object} res - The response object.
 */
exports.recommendBookForClub = async (req, res) => {
    const { clubId } = req.params; // Extract the clubId from the URL parameter
    const { bookId } = req.body; // Extract the bookId from the request body

    try {
        // Find the club by ID and update its Wishlist to include the recommended book
        const updatedClub = await Club.findByIdAndUpdate(
            clubId,
            { $addToSet: { Wishlist: bookId } }, // Use $addToSet to avoid adding duplicate entries
            { new: true, runValidators: true } // Return the updated document and run validators
        ).populate('Wishlist'); // Optionally populate the Wishlist to return it in the response

        if (!updatedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }

        res.status(200).json({ message: 'Book recommended successfully', Wishlist: updatedClub.Wishlist });
    } catch (error) {
        console.error("Error recommending book for the club:", error);
        res.status(500).send('Server error');
    }
};

exports.setCurrentBook = async (req, res) => {
    const { clubId } = req.params;
    const { bookId } = req.body;

    try {
        const book = await validateBookExists(bookId, res);

        let club = await validateClubExists(clubId, res);

        // If the book is in the wishlist, remove it
        if (club.Wishlist.some(book => book._id.toString() === bookId)) {
            club.Wishlist = club.Wishlist.filter(book => book._id.toString() !== bookId);
        }

        // Set the book as the current book and add the club to the book's ClubsReading list if not already present
        club.CurrentBook = bookId;
        if (!book.ClubsReading.includes(clubId)) {
            book.ClubsReading.push(clubId);
            await book.save();
        }

        await club.save();
        res.status(200).json({ message: 'Current book updated successfully', club });
    } catch (error) {
        console.error("Error setting current book:", error);
        res.status(500).send('Server error');
    }
};

exports.markCurrentBookAsRead = async (req, res) => {
    const { clubId } = req.params;

    try {
        const club = await validateClubExists(clubId, res);

        const book = await validateBookExists(club.currentBook, res);

        // Add the current book to the club's BooksRead list if not already present
        if (!club.BooksRead.includes(club.CurrentBook.toString())) {
            club.BooksRead.push(club.CurrentBook);
        }

        // Remove the club from the book's ClubsReading list
        book.ClubsReading = book.ClubsReading.filter(clubIdItem => clubIdItem.toString() !== clubId);
        await book.save();

        // Clear the CurrentBook field
        club.CurrentBook = null;
        await club.save();
        res.status(200).json({ message: 'Current book marked as read and updated successfully', club });
    } catch (error) {
        console.error("Error marking current book as read:", error);
        res.status(500).send('Server error');
    }
};
