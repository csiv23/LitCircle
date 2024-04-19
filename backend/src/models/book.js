const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    GoogleBooksId : {
        type: String,
        required: true,
        unique: true,
    },
    Author: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    CoverImageUrl: {
        type: String,
    },
    ClubsReading: [{
        type: Schema.Types.ObjectId,
        ref: 'Club' 
    }]
}, { collection: 'Book' });

module.exports = mongoose.model('Book', bookSchema);
