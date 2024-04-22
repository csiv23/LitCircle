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

exports.getUpcomingMeetings = async (req, res) => {
    try {
        // Fetch all clubs and populate the NextMeeting field
        const clubs = await Club.find().populate('NextMeeting');

        // Map through the clubs to extract the next meeting details
        const upcomingMeetings = clubs.map(club => ({
            ClubId: club._id, // Extracting the Club ID
            ClubName: club.Name, // Extracting the Club Name
            NextMeetingDate: club.NextMeeting ? club.NextMeeting.Date : 'No upcoming meeting',
            NextMeetingLocation: club.NextMeeting ? club.NextMeeting.Location : 'TBA'
        })).filter(meeting => meeting.NextMeetingDate !== 'No upcoming meeting'); // Filter out clubs without a scheduled next meeting

        res.json(upcomingMeetings); // Send the upcoming meetings info as a response
    } catch (error) {
        console.error("Error fetching upcoming meetings:", error);
        res.status(500).json({ error: 'Server error while fetching upcoming meetings.' });
    }
};
