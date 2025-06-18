/**
 * @module routes/users
 * @description Gère les routes liées aux utilisateurs : authentification, CRUD, et accès par email.
 *
 * @requires express
 * @requires module:services/users
 * @requires module:middleware/private
 *
 * Le service `users` contient probablement des opérations asynchrones sur un modèle Mongoose,
 * notamment pour l’authentification (`authenticate`), la récupération par email, ou les opérations CRUD.
 */

const express = require("express");
const router = express.Router();

const service = require("../services/users");
const privateRoute = require("../middleware/private");

/**
 * @route POST /users/login
 * @desc Authentifie un utilisateur
 * @access Public
 * @param {Object} body - Identifiants de connexion (email, mot de passe)
 * @returns {Object} Token JWT et informations utilisateur
 */
router.post("/login", service.authenticate);

/**
 * @route POST /users/logout
 * @desc Déconnecte un utilisateur
 * @access Public
 * @returns {Object} Confirmation de déconnexion
 */
router.post("/logout", service.logout);

/**
 * @route GET /users
 * @desc Récupère la liste de tous les utilisateurs
 * @access Privé
 * @returns {Array<Object>} Liste des utilisateurs
 */
router.get("/", privateRoute.checkJWT, service.getByAll);

/**
 * @route GET /users/:email
 * @desc Récupère les infos d'un utilisateur par email
 * @access Privé
 * @param {string} email - Email de l'utilisateur
 * @returns {Object} Utilisateur correspondant
 */
router.get("/:email", privateRoute.checkJWT, service.getByMail);

/**
 * @route POST /users
 * @desc Ajoute un nouvel utilisateur
 * @access Public
 * @param {Object} body - Données du nouvel utilisateur
 * @returns {Object} Utilisateur créé
 */
router.post("/", service.add);

/**
 * @route PUT /users/:email
 * @desc Modifie un utilisateur par email
 * @access Privé
 * @param {string} email - Email de l'utilisateur à modifier
 * @param {Object} body - Données à mettre à jour
 * @returns {Object} Utilisateur modifié
 */
router.put("/:email", privateRoute.checkJWT, service.update);

/**
 * @route GET /users/:email/edit
 * @desc Récupère la page d'édition pour un utilisateur
 * @access Privé
 * @param {string} email - Email de l'utilisateur
 * @returns {Object} Utilisateur à éditer
 */
router.get("/:email/edit", privateRoute.checkJWT, service.getByMail);

/**
 * @route DELETE /users/:email
 * @desc Supprime un utilisateur par email
 * @access Privé
 * @param {string} email - Email de l'utilisateur à supprimer
 * @returns {Object} Confirmation de suppression
 */
router.delete("/:email", privateRoute.checkJWT, service.delete);

module.exports = router;
