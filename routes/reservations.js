var express = require('express');
var router = express.Router();

const service = require('../services/reservations');
const private = require('../middleware/private');

/* GET users listing. */

// La route pour lire toutes les réservations d’un catway
router.get('/:id/reservations', private.checkJWT, service.getByAll);

// La route pour lire une réservation précise
router.get('/:id/reservations/:idReservation',private.checkJWT, service.getById);

// La route pour ajouter une réservation
router.post('/:id/reservations',private.checkJWT, service.add);

// La route pour modifier une réservation
router.put('/:id/reservations',private.checkJWT, service.update);

// La route pour supprimer une réservation
router.delete('/:id/reservations/:idReservation',private.checkJWT, service.delete);


module.exports = router;