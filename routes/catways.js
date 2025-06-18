var express = require('express');
var router = express.Router();

const service = require('../services/catways');
const privateRoute = require('../middleware/private');

/* GET users listing. */

// La route pour lire les infos des catways
router.get('/',privateRoute.checkJWT,  service.getByAll)

// La route pour lire les infos d'un catway
router.get('/:id',privateRoute.checkJWT,  service.getById);

// La route pour ajouter un catway
router.post('/',privateRoute.checkJWT, service.add);

// La route pour modifier un catway
router.put('/:id',privateRoute.checkJWT, service.update);

// La route pour supprimer un catway
router.delete('/:id',privateRoute.checkJWT, service.delete);


/* Routes alternatives pour formulaire HTML (POST seulement) */

// La route pour modifier un catway
router.post('/:id/update',privateRoute.checkJWT, service.update);

// La route pour supprimer un catway
router.post('/:id/delete',privateRoute.checkJWT, service.delete);

module.exports = router;