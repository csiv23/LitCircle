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
        res.status(500).json({ error: 'Internal server error while fetching all clubs.' });
    }
};

// Fetches and returns a single club by its ID
exports.getClub = async (req, res) => {
    try {
        const club = await validateClubExists(req.params.clubId, res);
        if (!club) {
            // Since validateClubExists sends the response, just return here.
            return;
        }

        club.NextMeeting.Date = club.NextMeeting.Date.toISOString()
        res.json(club);
    } catch (error) {
        console.error("Error fetching club by ID:", error);
        res.status(500).json({ error: 'Internal server error while fetching the club by ID.' });
    }
};

/**
 * Creates a new club with the given details in the request body.
 * It checks if the organizer exists before creating the club.
 */
exports.createClub = async (req, res) => {
    const { Name, Description, Organizer } = req.body;

    try {
        const organizer = await validateUserExists(Organizer);
        if (!organizer) return; // Already handled in validateUserExists

        const newClub = new Club({
            Name,
            Description,
            Members: [Organizer], // Initial member is the organizer
            BooksRead: [],
            Wishlist: [],
            CurrentBook: null,
            Organizer,
            ImageUrl: "",
        });

        await newClub.save();
        organizer.BookClubs.push({ ClubId: newClub._id, IsLeader: true, JoinDate: new Date() });
        await organizer.save();

        res.json({ message: "Club created successfully", clubID: newClub.id });
    } catch (error) {
        console.error("Error creating new club:", error);
        res.status(500).json({ error: 'Internal server error while creating a new club.' });
    }
};

/**
 * Updates the specified club's information based on the data provided in the request body.
 */
exports.updateClubInfo = async (req, res) => {
    try {
        const club = await validateClubExists(req.params.clubId, res);
        // No need to proceed if club doesn't exist as validateClubExists handles the response
        if (!club) return;

        const updateData = req.body;
        if (updateData.Organizer) {
            const organizer = await validateUserExists(updateData.Organizer, res);
            // No need to proceed if organizer doesn't exist as validateUserExists handles the response
            if (!organizer) return;
        }

        Object.assign(club, updateData);
        await club.save();
        res.json({ message: 'Club updated successfully', club });
    } catch (error) {
        console.error("Error updating club info:", error);
        res.status(500).json({ error: 'Internal server error while updating club information.' });
    }
};

/**
 * Adds a user to a club's member list based on the user ID provided in the request body.
 */
exports.joinClub = async (req, res) => {
    const { clubId } = req.params; // Extract the clubId from the URL parameter
    const { userId } = req.body; 
    try {
        const club = await validateClubExists(clubId, res);
        // If validation failed and response is handled, stop further execution.
        if (!club) return;

        const user = await validateUserExists(userId, res);
        // If validation failed and response is handled, stop further execution.
        if (!user) return;

        if (club.Members.map(member => member.toString()).includes(userId)) {
            return res.status(400).json({ message: 'User already a member of the club' });
        }

        club.Members.push(userId);
        await club.save();

        const alreadyJoined = user.BookClubs.some(club => club.ClubId.toString() === clubId);
        if (!alreadyJoined) {
            user.BookClubs.push({
                ClubId: clubId,
                IsLeader: false,
                JoinDate: new Date()  // Sets the current date
            });
            await user.save();
        }

        res.json({ message: 'User added to club successfully', club });
    } catch (error) {
        console.error("Error adding user to club:", error);
        res.status(500).json({ error: 'Internal server error while adding a user to the club.' });
    }
};


/**
 * Removes a user from a club's member list based on the user ID provided in the request body.
 */
exports.leaveClub = async (req, res) => {
    const { clubId } = req.params; // Extract the clubId from the URL parameter
    const { userId } = req.body; 

    try {
        const club = await validateClubExists(clubId, res);
        const user = await validateUserExists(userId, res);
        if (!club || !user) return; // Already handled in validate*

        club.Members = club.Members.filter(member => member.toString() !== userId);
        await club.save();

        user.BookClubs = user.BookClubs.filter(bookclub => bookclub.ClubId !== clubId);
        await user.save();

        res.json({ message: 'User removed from club successfully' });
    } catch (error) {
        console.error("Error removing user from club:", error);
        res.status(500).json({ error: 'Internal server error while removing a user from the club.' });
    }
};

/**
 * A specialized function for fetching members of a club with detailed user information.
 */
exports.fetchClubMembers = async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId).populate('Members');
        if (!club) return; // Already handled in validateClubExists

        if (club.Members.length === 0) {
            return res.status(404).json({ message: 'No members found for this club' });
        }
        res.json({ Members: club.Members });
    } catch (error) {
        console.error("Error fetching club members:", error);
        res.status(500).json({ error: 'Internal server error while fetching club members.' });
    }
};

/**
 * Fetches the organizer of a club with detailed user information.
 */
exports.fetchClubOrganizer = async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId).populate('Organizer');
        if (!club || !club.Organizer) {
            return res.status(404).json({ message: 'Organizer not found for this club' });
        }
        res.json({ Organizer: club.Organizer });
    } catch (error) {
        console.error("Error fetching club organizer:", error);
        res.status(500).json({ error: 'Internal server error while fetching the club organizer.' });
    }
};

exports.fetchClubAttribute = (attributeName) => {
    return async (req, res) => {
        const club = await validateClubExists(req.params.clubId, res);
        if (!club) return; // validateClubExists will handle the response if the club doesn't exist

        try {
            const populatedClub = await Club.findById(club._id).populate(attributeName);
            if (!populatedClub || !populatedClub[attributeName]) {
                return res.status(404).json({ message: `${attributeName} not found in club details` });
            }

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
        if (!book) {
            // If the book doesn't exist, validateBookExists has already handled the response.
            return;
        }

        const club = await validateClubExists(clubId, res);
        if (!club) {
            // If the club doesn't exist, validateClubExists has already handled the response.
            return;
        }

        // Check if the book is in the wishlist and remove it if present
        club.Wishlist = club.Wishlist.filter(wish => wish.toString() !== bookId);

        // Set the book as the current book
        club.CurrentBook = bookId;

        // Add the club to the book's ClubsReading list if not already present
        if (!book.ClubsReading.map(club => club.toString()).includes(clubId)) {
            book.ClubsReading.push(clubId);
            await book.save();
        }

        await club.save();
        res.status(200).json({ message: 'Current book updated successfully', club });
    } catch (error) {
        console.error("Error setting current book:", error);
        // Use json for consistent error response format
        res.status(500).json({ error: 'Internal server error while setting the current book.' });
    }
};


exports.markCurrentBookAsRead = async (req, res) => {
    const { clubId } = req.params;

    try {
        const club = await validateClubExists(clubId, res);
        const book = await validateBookExists(club.CurrentBook, res);
        if (!club || !book) return; // Already handled in validate*


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

exports.deleteClub = async (req, res) => {
    const clubId = req.params.clubId;

    try {
        const club = await validateClubExists(clubId, res);
        if (!club) {
            // validateClubExists handles the response if the club is not found.
            return;
        }

        // Iterate through all members of the club and remove the club from their BookClubs list.
        await Promise.all(club.Members.map(async memberId => {
            const member = await User.findById(memberId);
            if (member) {
                member.BookClubs = member.BookClubs.filter(bookClub => bookClub.ClubId.toString() !== clubId);
                await member.save();
            }
        }));

        // After updating all members, delete the club.
        await Club.findByIdAndDelete(clubId);

        res.status(200).json({ message: 'Club deleted successfully' });
    } catch (error) {
        console.error("Error deleting club:", error);
        res.status(500).json({ error: 'Internal server error while deleting the club.' });
    }
};


exports.addBookToWishlist = async (req, res) => {
    const { clubId } = req.params;
    const { bookId } = req.body;

    try {
        const club = await validateClubExists(clubId, res);
        if (!club) {
            return;
        }

        const book = await validateBookExists(bookId, res);
        if (!book) {
            return;
        }

        // Check if the book is currently being read or has been read
        const isCurrentlyReading = club.CurrentBook && club.CurrentBook.toString() === bookId;
        const hasBeenRead = club.BooksRead.some(b => b.toString() === bookId);

        if (isCurrentlyReading || hasBeenRead) {
            return res.status(400).json({ message: 'Book cannot be added to the wishlist as it is currently being read or has already been read by the club.' });
        }

        // Check if the book is already in the wishlist
        const isInWishlist = club.Wishlist.some(b => b.toString() === bookId);
        if (isInWishlist) {
            return res.status(200).json({ message: 'Book is already in the wishlist.' });
        }

        // Add the book to the wishlist
        club.Wishlist.push(bookId);
        await club.save();

        res.status(200).json({ message: 'Book added to the wishlist successfully', club });
    } catch (error) {
        console.error('Error adding book to the club\'s wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteBookFromWishlist = async (req, res) => {
    const { clubId } = req.params;
    const { bookId } = req.body;

    const club = await validateClubExists(clubId, res);
    if (!club) {
        return;
    }

    const book = await validateBookExists(bookId, res);
    if (!book) {
        return;
    }

    // Check if the book is in the wishlist
    const isInWishlist = club.Wishlist.some(b => b.toString() === bookId);
    if (!isInWishlist) {
        return res.status(400).json({ message: 'Book is not in the wishlist.' });
    }

    // Remove the book from the wishlist
    club.Wishlist = club.Wishlist.filter(b => b.toString() !== bookId);
    await club.save();

    res.status(200).json({ message: 'Book removed from the wishlist successfully', club });
}


exports.setNewMeeting = async (req, res) => {
    const { clubId } = req.params;
    const { meeting } = req.body;

    // Validate the meeting object
    if (!meeting || !meeting.Date || !meeting.Location) {
        res.status(400).json({ message: 'Invalid meeting object' });
        return;
    }

    try {
        const club = await validateClubExists(clubId, res);
        if (!club) {
            return;
        }

        // Replace the meeting
        club.NextMeeting = meeting;
        await club.save();

        res.status(200).json({ message: 'Meeting updated successfully', club });
    } catch (error) {
        console.error('Error updating a meeting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Route to search clubs by name or partial name
exports.searchClubs = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Name parameter is required' });
    }

    try {
        const clubs = await Club.find({ Name: { $regex: name, $options: 'i' } });
        res.json(clubs);
    } catch (error) {
        console.error('Error searching clubs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};