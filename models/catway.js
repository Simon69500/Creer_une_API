const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Catway = new Schema({
    catwayNumber: {
        type: Number,
        trim: true,
        unique: true,
        required: [true, 'le numéro est requis'],
        min: [1, 'le numéro doit être au moins de 1']
    },
    catwayType: {
        type: String,
        trim: true,
        enum: ['short', 'long'],
        required: [true, 'le type est requis']
    },
    catwayState: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'l\'état est requis']
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Catway', Catway);