var express = require('express');
var router = express.Router();

const service = require('../services/catways');
const private = require('../middleware/private');

/* GET users listing. */

// La route pour lire les infos des catways
router.get('/',private.checkJWT,  service.getByAll)

// La route pour lire les infos d'un catway
router.get('/:id',private.checkJWT,  service.getById);

// La route pour ajouter un catway
router.post('/',private.checkJWT, service.add);

// La route pour modifier un catway
router.put('/:id',private.checkJWT, service.update);

// La route pour supprimer un catway
router.delete('/:id',private.checkJWT, service.delete);


/* Routes alternatives pour formulaire HTML (POST seulement) */

// La route pour modifier un catway
router.post('/:id/update',private.checkJWT, service.update);

// La route pour supprimer un catway
router.post('/:id/delete',private.checkJWT, service.delete);

module.exports = router;