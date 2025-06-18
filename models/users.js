const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

/**
 * @module models/user
 * @description
 * Modèle Mongoose représentant un utilisateur.
 * Ce modèle définit le schéma utilisateur avec nom, email unique et mot de passe hashé.
 * Inclut un middleware pour hasher le mot de passe avant sauvegarde.
 * 
 * Utilise bcrypt pour le hash des mots de passe.
 * 
 * @requires mongoose - Bibliothèque de modélisation d’objets MongoDB
 * @requires bcrypt - Bibliothèque pour le hashage sécurisé des mots de passe
 */

/**
 * Schéma Mongoose pour un utilisateur.
 * @typedef {Object} User
 * @property {string} name - Le nom de l'utilisateur (obligatoire).
 * @property {string} email - L'adresse email unique de l'utilisateur (obligatoire).
 * @property {string} password - Le mot de passe hashé de l'utilisateur (obligatoire).
 * @property {Date} createdAt - Date de création (automatique).
 * @property {Date} updatedAt - Date de dernière mise à jour (automatique).
 */
const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'le nom est requis']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'l\'email est requis'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'le mot de passe est requis']
    }
}, {
    timestamps: true,
});

/**
 * Middleware Mongoose qui hash le mot de passe avant sauvegarde.
 * Ne fait rien si le mot de passe n'a pas été modifié.
 * @param {Function} next - La fonction middleware pour passer au suivant.
 */
User.pre('save', function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);

    next();
});

module.exports = mongoose.model('User', User);
