const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = new Schema({
    catwayNumber: {
        type: Number,
        trim: true,
        required: [true, 'le numéro est requis'],
        min: [1, 'le numéro doit être au moins de 1']
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientName: {
        type: String,
        trim: true,
        required: [true, 'le nom est requis']
    },
    boatName: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        trim: true,
        required: [true, 'la date du début est requis']
    },
    endDate: {
        type: Date,
        trim: true,
        required: [true, 'la date de fin est requis']
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Reservation', Reservation);