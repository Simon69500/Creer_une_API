var express = require('express');
var router = express.Router();

const service = require('../services/catways');


/* GET users listing. */

// La route pour lire les infos des catways
router.get('/',  service.getByAll)

// La route pour lire les infos d'un catway
router.get('/:id',  service.getById);

// La route pour ajouter un catway
router.post('/', service.add);

// La route pour modifier un catway
router.put('/:id', service.update);

// La route pour supprimer un catway
router.delete('/:id', service.delete);

module.exports = router;