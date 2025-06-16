var express = require('express');
var router = express.Router();

const service = require('../services/users');
const private = require('../middleware/private');


/* GET users listing. */

// route pour l'authentification + logout
router.post('/login', service.authenticate);
router.get('/logout', service.logout);

// La route pour lire les infos des utilisateur
router.get('/', private.checkJWT, service.getByAll)

// La route pour lire les infos d'un utilisateur
router.get('/:email', service.getByMail);

// La route pour ajouter un utilisateur
router.post('/', service.add);


// La route pour modifier un utilisateur
router.put('/:email', private.checkJWT, service.update);

// La route pour supprimer un utilisateur
router.delete('/:email', private.checkJWT, service.delete);

module.exports = router;
