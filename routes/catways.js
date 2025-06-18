/**
 * @module routes/catways
 * @description Définit les routes liées aux opérations CRUD des catways.
 * 
 * @requires express
 * @requires module:services/catways
 * @requires module:middleware/private
 * 
 * Ce module utilise des middlewares d'authentification via JWT (`privateRoute.checkJWT`),
 * et s'appuie sur des fonctions définies dans `services/catways`, lesquelles
 * interagissent probablement avec un modèle Mongoose pour les données de type Catway.
 */

const express = require('express');
const router = express.Router();

const service = require('../services/catways');
const privateRoute = require('../middleware/private');

/**
 * @route GET /catways
 * @desc Récupérer la liste de tous les catways
 * @access Privé
 * @returns {Array<Object>} Liste des catways
 */
router.get('/', privateRoute.checkJWT, service.getByAll);

/**
 * @route GET /catways/:id
 * @desc Récupérer un catway par son identifiant
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @returns {Object} Catway trouvé
 */
router.get('/:id', privateRoute.checkJWT, service.getById);

/**
 * @route POST /catways
 * @desc Ajouter un nouveau catway
 * @access Privé
 * @param {Object} body - Données du catway à créer
 * @returns {Object} Catway créé
 */
router.post('/', privateRoute.checkJWT, service.add);

/**
 * @route PUT /catways/:id
 * @desc Modifier un catway existant
 * @access Privé
 * @param {string} id - Identifiant du catway à modifier
 * @param {Object} body - Données mises à jour
 * @returns {Object} Catway modifié
 */
router.put('/:id', privateRoute.checkJWT, service.update);

/**
 * @route DELETE /catways/:id
 * @desc Supprimer un catway par son identifiant
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @returns {Object} Confirmation de suppression
 */
router.delete('/:id', privateRoute.checkJWT, service.delete);

/**
 * @route POST /catways/:id/update
 * @desc Modifier un catway via un formulaire HTML
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @param {Object} body - Données mises à jour
 * @returns {Object} Catway modifié
 */
router.post('/:id/update', privateRoute.checkJWT, service.update);

/**
 * @route POST /catways/:id/delete
 * @desc Supprimer un catway via un formulaire HTML
 * @access Privé
 * @param {string} id - Identifiant du catway
 * @returns {Object} Confirmation de suppression
 */
router.post('/:id/delete', privateRoute.checkJWT, service.delete);

module.exports = router;
