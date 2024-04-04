const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    Author: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    ClubsReading: [{
        type: Schema.Types.ObjectId,
        ref: 'Club' 
    }]
}, { collection: 'Book' });

module.exports = mongoose.model('Book', bookSchema);
