const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Username: {
        type: String,
        required: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    AvatarUrl: {
        type: String,
    },
    Role: {
        type: String,
        required: false
    },
    JoinDate: {
        type: Date,
        default: Date.now
    },
    Following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    Followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    Wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    BooksRead: [{
        type: Schema.Types.ObjectId,
        ref: 'Book'
    }],
    BookClubs: [{
        ClubId: {
            type: Schema.Types.ObjectId,
            ref: 'Club'
        },
        IsLeader: Boolean,
        JoinDate: Date
    }]
}, {collection : 'User' });


module.exports = mongoose.model('User', userSchema);
