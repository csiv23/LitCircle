const Club = require('../models/club');
const User = require('../models/user');
const Book = require('../models/book');

const { validateBookExists, validateClubExists, validateUserExists, validateBookbyId } = require('../utilities/dataValidation');

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
        
        // Safely access NextMeeting and Date properties
        let nextMeetingInfo = {};
        if (club.NextMeeting && club.NextMeeting.Date) {
            nextMeetingInfo = {
                ...club.NextMeeting,
                Date: club.NextMeeting.Date.toISOString() // Safely converting Date to ISO string
            };
        }

        // Respond with club info, including NextMeeting if available
        res.json({
            ...club.toObject(), 
            NextMeeting: nextMeetingInfo
        });

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
    const { name, description, organizer, imageUrl } = req.body;

    // Validate required fields are not empty
    if (!name || !description || !organizer) {
        return res.status(400).json({ error: 'Missing required fields. Name, description, and organizer are required.' });
    }

    try {
        // Check if the organizer exists using the organizer ID provided
        const organizerExists = await validateUserExists(organizer);
        if (!organizerExists) {
            // If the organizer doesn't exist, return a 404 error
            return res.status(404).json({ error: 'Organizer not found. You must specify a valid organizer ID.' });
        }

        // Create a new club with the provided data
        const newClub = new Club({
            Name: name,
            Description: description,
            Members: [organizer], // Initialize with the organizer as the first member
            BooksRead: [],
            Wishlist: [],
            CurrentBook: null,
            Organizer: organizer,
            ImageUrl: imageUrl || "" // Use an empty string as default if no image URL is provided
        });

        // Save the new club to the database
        await newClub.save();

        // Update the organizer's document to include the new club
        organizerExists.BookClubs.push({ ClubId: newClub._id, IsLeader: true, JoinDate: new Date() });
        await organizerExists.save();

        // Respond with success message and the ID of the newly created club
        res.json({ message: "Club created successfully", clubID: newClub._id });
    } catch (error) {
        console.error("Error creating new club:", error);
        res.status(500).json({ error: 'Internal server error while creating a new club.', details: error.message });
    }
};


/**
 * Updates the specified club's information based on the data provided in the request body.
 */
exports.updateClubInfo = async (req, res) => {
    try {
        const { clubId } = req.params;

        const club = await validateClubExists(req.params.clubId, res);
        // No need to proceed if club doesn't exist as validateClubExists handles the response
        if (!club) return;

        const clubData = req.body.data;
    
        const updateData = (clubData && clubData.NextMeeting && clubData.NextMeeting.Date)
        ? {
            ...clubData,
            NextMeeting : {
                ...clubData.NextMeeting,
                Date : new Date(clubData.NextMeeting.Date)
            }
        } : clubData;

        console.log(updateData);

        if (updateData.Organizer) {
            const organizer = await validateUserExists(updateData.Organizer, res);
            // No need to proceed if organizer doesn't exist as validateUserExists handles the response
            if (!organizer) return;
        }
        
        Object.assign(club, updateData);
        await club.save();
        
        console.log(club);
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
            return res.status(200).json({ message: 'User already a member of the club' });
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

        req.session["currentUser"] = user;
        res.json(club);
    } catch (error) {
        console.error("Error adding user to club:", error);
        res.status(500).json({ error: 'Internal server error while adding a user to the club.' });
    }
};


/**
 * Removes a user from a club's member list based on the user ID provided in the request body.
 * If the user is the organizer, they must appoint a new organizer and update leadership status before leaving.
 */
exports.leaveClub = async (req, res) => {
    const { clubId } = req.params; // Extract the clubId from the URL parameter
    const { userId, newOrganizerId } = req.body; // Include newOrganizerId if the organizer is leaving

    try {
        const club = await validateClubExists(clubId, res);
        const user = await validateUserExists(userId, res);
        if (!club || !user) return; // Validation handlers take care of responses

        // Check if the user is the organizer
        if (club.Organizer.toString() === userId) {
            if (!newOrganizerId) {
                return res.status(400).json({ error: 'A new organizer must be assigned before the current organizer can leave.' });
            }
            const newOrganizer = await validateUserExists(newOrganizerId, res);
            if (!newOrganizer) return; // validateUserExists should handle the response
            if (!club.Members.includes(newOrganizerId)) {
                return res.status(400).json({ error: 'New organizer must be a current member of the club.' });
            }
            club.Organizer = newOrganizerId;
            // Update the new organizer's IsLeader status in their BookClubs list
            newOrganizer.BookClubs = newOrganizer.BookClubs.map(bookclub => {
                if (bookclub.ClubId.toString() === clubId) {
                    return { ...bookclub.toObject(), IsLeader: true };
                }
                return bookclub;
            });
            await newOrganizer.save();
        }

        // Remove the user from the club's members list
        club.Members = club.Members.filter(member => member.toString() !== userId);
        await club.save();

        // Remove the club from the user's BookClubs list and update IsLeader if needed
        user.BookClubs = user.BookClubs.filter(bookclub => {
            if (bookclub.ClubId.toString() === clubId) {
                // If the leaving user is the organizer, clear the IsLeader flag
                bookclub.IsLeader = false;
            }
            return bookclub.ClubId.toString() !== clubId;
        });
        await user.save();

        // req.session["currentUser"] = user;
        res.json(club);
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
            // Check if attributeName is "currentBook" and if populatedClub or the attribute is null
            if (attributeName === "currentBook" && (!populatedClub || !populatedClub[attributeName])) {
                // Return an empty string if currentBook doesn't exist or is null
                return res.json({ [attributeName]: "" });
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
        const book = await validateBookbyId(bookId, res);
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
        const book = await validateBookbyId(club.CurrentBook, res);
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
            res.status(200).json({ message: 'Club already does not exist' });
        }

        // Iterate through all members of the club and remove the club from their BookClubs list.
        await Promise.all(club.Members.map(async memberId => {
            const member = await User.findById(memberId);
            if (member) {
                member.BookClubs = member.BookClubs.filter(bookClub => bookClub.ClubId.toString() !== clubId);
                await member.save();
            }
        }));
        
        if (club.CurrentBook) {
            const currentBook = await Club.findById(club.CurrentBook)
            if (currentBook) {
                currentBook.ClubsReading = currentBook.ClubsReading.filter(bookClub => bookClub.ClubId.toString() !== clubId);
                await currentBook.save();
            }
        }

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

        const book = await validateBookbyId(bookId, res);
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
    const { clubId, bookId } = req.params;

    const club = await validateClubExists(clubId, res);
    if (!club) {
        return;
    }

    console.log(bookId);
    const book = await validateBookbyId(bookId, res);
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

exports.addBookToBooksRead = async (req, res) => {
    const { clubId } = req.params;
    const { bookId } = req.body;

    try {
        const club = await validateClubExists(clubId, res);
        if (!club) {
            return;
        }

        const book = await validateBookbyId(bookId, res);
        if (!book) {
            return;
        }

        // Check if the book is already in booksRead
        const isInBooksRead = club.BooksRead.some(b => b.toString() === bookId);
        if (isInBooksRead) {
            return res.status(200).json({ message: 'Book is already in the list of books read.' });
        }

        // Add the book to the booksRead
        club.BooksRead.push(bookId);
        await club.save();

        res.status(200).json({ message: 'Book added to books read list successfully', club });
    } catch (error) {
        console.error('Error adding book to the club\'s books read list :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteBookFromBooksRead = async (req, res) => {
    const { clubId, bookId } = req.params;

    const club = await validateClubExists(clubId, res);
    if (!club) {
        return;
    }

    console.log(bookId);
    const book = await validateBookbyId(bookId, res);
    if (!book) {
        return;
    }

    // Check if the book is in the list
    const isInBooksRead = club.BooksRead.some(b => b.toString() === bookId);
    if (!isInBooksRead) {
        return res.status(400).json({ message: 'Book is not in the list of books read.' });
    }

    // Remove the book from the list
    club.BooksRead = club.BooksRead.filter(b => b.toString() !== bookId);
    await club.save();

    res.status(200).json({ message: 'Book removed from the list of books read successfully', club });
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