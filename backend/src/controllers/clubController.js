const Club = require('../models/club');
const User = require('../models/user'); 

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

exports.getClub = async (req, res) => {
    const { clubId } = req.params;
    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).send('Club not found');
        }
        res.json(club);
    } catch (error) {
        console.error("Error fetching club:", error);
        res.status(500).send('Server error');
    }
};

exports.createClub = async (req, res) => {
    const { Name, Description, Organizer } = req.body;

    try {
        // Check if the Organizer exists
        const organizer = await User.findById(Organizer);
        if (!organizer) {
            return res.status(404).json({ msg: 'Organizer not found' });
        }

        // Create a new club with the provided details
        const newClub = new Club({
            Name,
            Description,
            Members: [Organizer], // Automatically add the organizer as a member
            BooksRead: [],
            Wishlist: [],
            CurrentBook: null,
            NextMeeting: null,
            Organizer,
        });

        await newClub.save();

        // Update the organizer's BookClubs array to include the new club with IsLeader set to true
        organizer.BookClubs.push({
            ClubId: newClub._id,
            IsLeader: true,
            JoinDate: new Date() // Set the join date to now
        });

        await organizer.save(); // Save the updated organizer document

        // Respond with the new club's ID and a message indicating success
        res.json({ 
            message: "Club created and organizer updated successfully", 
            clubID: newClub.id 
        });
    } catch (error) {
        console.error("Error creating new club or updating organizer:", error);
        res.status(500).send('Server error');
    }
};

// Controller function to update information about a specific club.
exports.updateClubInfo = async (req, res) => {
    const { clubId } = req.params;
    const updateData = req.body;

    try {
        // If the request attempts to update the organizer, check if the new organizer exists.
        if (updateData.Organizer) {
            const organizerExists = await User.findById(updateData.Organizer);
            if (!organizerExists) {
                return res.status(404).json({ message: 'Organizer not found' });
            }
        }

        // Attempting to find the club by its ID and update it with the provided data.
        const updatedClub = await Club.findByIdAndUpdate(clubId, updateData, { new: true, runValidators: true });

        // If no club is found with the given ID, return a 404 Not Found response.
        if (!updatedClub) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // If the club is found and updated, return a success message along with the updated club data.
        res.json({ message: 'Club updated successfully', updatedClub });
    } catch (error) {
        console.error("Error updating club information:", error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }

        // Return a 500 Server Error response if something goes wrong during the update process.
        res.status(500).send('Server error');
    }
};

// Handler for a user to join a book club
exports.joinClub = async (req, res) => {
    const { clubId } = req.params;
    const { userId } = req.body; // Assuming the userID is sent in the request body

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (club.Members.includes(userId)) {
            return res.status(400).json({ message: 'User already a member of the club' });
        }

        // Add the user to the club's Members array
        club.Members.push(userId);
        await club.save();

        // Additionally, update the user's BookClubs array to include the new club
        user.BookClubs.push({
            ClubId: club._id,
            IsLeader: false, // Assuming the user is not a leader when they join
            JoinDate: new Date() // Set the join date to now
        });
        await user.save();

        res.status(200).json({ message: 'User added to club successfully', club });
    } catch (error) {
        console.error("Error joining club:", error);
        res.status(500).send('Server error');
    }
};

// Handler for a user to leave a book club
exports.leaveClub = async (req, res) => {
    const { clubId } = req.params;
    const { userId } = req.body; // Assuming the userID is sent in the request body

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is actually a member of the club
        if (!club.Members.includes(userId)) {
            return res.status(400).json({ message: 'User is not a member of the club' });
        }

        // Remove the user from the club's Members array
        club.Members = club.Members.filter(memberId => memberId.toString() !== userId);
        await club.save();

        // Remove the club from the user's BookClubs array
        user.BookClubs = user.BookClubs.filter(bookClub => bookClub.ClubId.toString() !== clubId);
        await user.save();

        res.status(200).json({ message: 'User removed from club successfully' });
    } catch (error) {
        console.error("Error leaving club:", error);
        res.status(500).send('Server error');
    }
};
