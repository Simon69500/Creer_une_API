var express = require('express');
var router = express.Router();

const service = require('../services/reservations');

/* GET users listing. */

// La route pour lire toutes les réservations d’un catway
router.get('/:id/reservations', service.getByAll);

// La route pour lire une réservation précise
router.get('/:id/reservations/:idReservation', service.getById);

// La route pour ajouter une réservation
router.post('/:id/reservations', service.add);

// La route pour modifier une réservation
router.put('/:id/reservations', service.update);

// La route pour supprimer une réservation
router.delete('/:id/reservations/:idReservation', service.delete);


module.exports = router;