var express = require('express');
var router = express.Router();

const service = require('../services/users');
const privateRoute = require('../middleware/private');


/* GET users listing. */

// route pour l'authentification + logout
router.post('/login', service.authenticate);
router.post('/logout', service.logout);

// La route pour lire les infos des utilisateur
router.get('/', privateRoute.checkJWT, service.getByAll)

// La route pour lire les infos d'un utilisateur
router.get('/:email',privateRoute.checkJWT, service.getByMail);

// La route pour ajouter un utilisateur
router.post('/', service.add);


// La route pour modifier un utilisateur
router.put('/:email', privateRoute.checkJWT, service.update);
router.get('/:email/edit', privateRoute.checkJWT, service.getByMail);

// La route pour supprimer un utilisateur
router.delete('/:email', privateRoute.checkJWT, service.delete);

module.exports = router;
