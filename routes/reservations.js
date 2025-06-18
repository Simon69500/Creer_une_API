var express = require('express');
var router = express.Router();

const service = require('../services/reservations');
const private = require('../middleware/private');


/* GET users listing. */
// La route pour lire toutes les réservations d’un catway
router.get('/catways/:id/reservations', private.checkJWT, service.getByAll);

// La route pour lire une réservation précise
router.get('/catways/:id/reservations/:idReservation', private.checkJWT, service.getById);

// La route pour ajouter une réservation
router.post('/catways/:id/reservations', private.checkJWT, service.add);

// La route pour modifier une réservation
router.put('/catways/:id/reservations/:idReservation', private.checkJWT, service.update);

// La route pour supprimer une réservation
router.delete('/catways/:id/reservations/:idReservation', private.checkJWT, service.delete);



/* Routes alternatives pour formulaire HTML (POST seulement) */
// La route pour modifier un catway
router.post('/:id/reservations/update',private.checkJWT, service.update);

// La route pour supprimer un catway
router.post('/:id/reservations/delete',private.checkJWT, service.delete);

module.exports = router;