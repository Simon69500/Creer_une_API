/**
 * @module routes/index
 * @description Routes principales pour le rendu des pages HTML :
 * - Page d'accueil publique
 * - Tableau de bord utilisateur
 * - Affichage des réservations, catways et utilisateurs
 *
 * Utilise les modèles Mongoose `User`, `Reservation`, et `Catway`.
 * Les méthodes comme `find`, `findOne`, `populate` impliquent des requêtes asynchrones à la base de données.
 */

const express = require('express');
const router = express.Router();

const privateRoute = require('../middleware/private');
const User = require('../models/users');
const Catway = require('../models/catway');
const Reservation = require('../models/reservations');

/**
 * @route GET /
 * @desc Page d'accueil publique
 * @access Public
 * @returns {HTML} Vue d'accueil
 */
router.get('/', function (req, res, next) {
  res.render('index');
});

/**
 * @route GET /dashboard
 * @desc Affiche le tableau de bord de l'utilisateur connecté avec ses réservations
 * @access Privé
 * @returns {HTML} Vue du tableau de bord avec l'utilisateur et ses réservations
 */
router.get('/dashboard', privateRoute.checkJWT, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email }).select('name email');
    if (!user) {
      return res.status(404).json('user_not_found');
    }

    const reservations = await Reservation.find({ userId: user._id }).populate('userId', 'name');
    res.render('dashboard', { user, reservations });
  } catch (err) {
    console.error('Erreur dans /dashboard :', err);
    res.status(500).json({ error: "internal_server_error" });
  }
});

/**
 * @route GET /reservations
 * @desc Affiche toutes les réservations
 * @access Privé
 * @returns {HTML} Vue avec liste des réservations
 */
router.get('/reservations', privateRoute.checkJWT, async (req, res, next) => {
  try {
    const reservations = await Reservation.find({});
    res.render('reservation', { reservations, catwayId: req.params.id || null });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /catways
 * @desc Affiche tous les catways
 * @access Privé
 * @returns {HTML} Vue avec liste des catways
 */
router.get('/catways', privateRoute.checkJWT, async (req, res, next) => {
  try {
    const catways = await Catway.find({});
    res.render('catway', { catways });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /users
 * @desc Affiche tous les utilisateurs
 * @access Privé
 * @returns {HTML} Vue avec liste des utilisateurs
 */
router.get('/users', privateRoute.checkJWT, async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render('user', { users });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
