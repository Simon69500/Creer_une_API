
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/**
 * @module models/catway
 * @description
 * Définit le schéma Mongoose pour un catway, représentant une entité avec un numéro unique,
 * un type (court ou long) et un état. Ce modèle inclut les timestamps de création et mise à jour.
 *
 * Ce module utilise :
 * @requires mongoose - ODM pour MongoDB, pour la définition du schéma et du modèle.
 *
 * Les opérations comme `save` ou `find` sur ce modèle sont asynchrones et communiquent avec la base de données.
 */

/**
 * Schéma Mongoose pour un catway.
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Le numéro unique du catway (obligatoire, min 1).
 * @property {'short'|'long'} catwayType - Le type de catway, soit 'short' soit 'long' (obligatoire).
 * @property {string} catwayState - L'état du catway (obligatoire).
 * @property {Date} createdAt - Date de création (automatique).
 * @property {Date} updatedAt - Date de dernière mise à jour (automatique).
 */
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
