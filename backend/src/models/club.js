const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    BooksRead: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    Wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    CurrentBook: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    NextMeeting: {
        Date: {
            type: Date,
            required: false
        },
        Location: {
            type: String,
            required: false
        }
    },
    ImageUrl: {
        type: String
    },
    Organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { collection: 'Club' });

module.exports = mongoose.model('Club', clubSchema);
