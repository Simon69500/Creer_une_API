/**
 * @module routes/reservations
 * @description Gère les routes liées aux réservations de catways.
 * 
 * @requires express
 * @requires module:services/reservations
 * @requires module:middleware/private
 * 
 * Les fonctions du service `reservations` effectuent probablement des opérations
 * Mongoose asynchrones (find, create, update, delete) pour gérer les documents
 * liés aux réservations.
 */

const express = require('express');
const router = express.Router();

const service = require('../services/reservations');
const privateRoute = require('../middleware/private');

/**
 * @route GET /catways/:id/reservations
 * @desc Récupère toutes les réservations d’un catway donné
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @returns {Array<Object>} Liste des réservations
 */
router.get('/catways/:id/reservations', privateRoute.checkJWT, service.getByAll);

/**
 * @route GET /catways/:id/reservations/:idReservation
 * @desc Récupère une réservation précise d’un catway
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @param {string} idReservation - Identifiant de la réservation
 * @returns {Object} Réservation trouvée
 */
router.get('/catways/:id/reservations/:idReservation', privateRoute.checkJWT, service.getById);

/**
 * @route POST /catways/:id/reservations
 * @desc Ajoute une réservation pour un catway donné
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @param {Object} body - Données de la réservation à créer
 * @returns {Object} Réservation créée
 */
router.post('/catways/:id/reservations', privateRoute.checkJWT, service.add);

/**
 * @route PUT /catways/:id/reservations/:idReservation
 * @desc Modifie une réservation précise d’un catway
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @param {string} idReservation - Identifiant de la réservation
 * @param {Object} body - Données mises à jour
 * @returns {Object} Réservation modifiée
 */
router.put('/catways/:id/reservations/:idReservation', privateRoute.checkJWT, service.update);

/**
 * @route DELETE /catways/:id/reservations/:idReservation
 * @desc Supprime une réservation précise d’un catway
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @param {string} idReservation - Identifiant de la réservation
 * @returns {Object} Confirmation de suppression
 */
router.delete('/catways/:id/reservations/:idReservation', privateRoute.checkJWT, service.delete);

/* Routes HTML (formulaires POST) */

/**
 * @route POST /:id/reservations/update
 * @desc Modifie une réservation (via formulaire HTML)
 * @access Privé
 * @param {string} id - Identifiant de la réservation
 * @param {Object} body - Données mises à jour
 * @returns {Object} Réservation modifiée
 */
router.post('/:id/reservations/update', privateRoute.checkJWT, service.update);

/**
 * @route POST /:id/reservations/delete
 * @desc Supprime une réservation (via formulaire HTML)
 * @access Privé
 * @param {string} id - Identifiant de la réservation
 * @returns {Object} Confirmation de suppression
 */
router.post('/:id/reservations/delete', privateRoute.checkJWT, service.delete);

module.exports = router;
