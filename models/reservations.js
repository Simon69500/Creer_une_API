const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @module models/reservation
 * @description
 * Modèle Mongoose représentant une réservation d’un catway.
 * Chaque réservation est liée à un utilisateur (via userId),
 * et contient les informations de réservation du catway, client et bateau.
 * 
 * Ce modèle utilise Mongoose pour la définition du schéma et la gestion de la base de données MongoDB.
 * 
 * @requires mongoose - Bibliothèque de modélisation d’objets MongoDB
 */

/**
 * Schéma Mongoose pour une réservation.
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Le numéro du catway (obligatoire, min 1).
 * @property {mongoose.Types.ObjectId} userId - Référence vers l'utilisateur qui a fait la réservation (obligatoire).
 * @property {string} clientName - Le nom du client (obligatoire).
 * @property {string} boatName - Le nom du bateau (obligatoire).
 * @property {Date} startDate - Date de début de la réservation (obligatoire).
 * @property {Date} endDate - Date de fin de la réservation (obligatoire).
 * @property {Date} createdAt - Date de création (automatique).
 * @property {Date} updatedAt - Date de dernière mise à jour (automatique).
 */
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
