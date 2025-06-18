var express = require('express');
var router = express.Router();
const private = require('../middleware/private');
const User = require('../models/users');
const Catway = require('../models/catway');
const Reservation = require('../models/reservations');


/* --- ROUTES HTML --- */

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/dashboard', private.checkJWT, (req, res) => {
  res.render('dashboard');
});

router.get('/reservations', private.checkJWT, async (req, res, next) => {
  try {
    const reservations = await Reservation.find({});
    res.render('reservation', { reservations, catwayId: req.params.id || null });
  } catch (error) {
    next(error);
  }
});


router.get('/catways', private.checkJWT, async (req, res, next) => {
  try {
    const catways = await Catway.find({});
    res.render('catway', { catways });
  } catch (error) {
    next(error);
  }
});

router.get('/user', private.checkJWT, (req, res) => {
  res.render('user');
});


/* --- ROUTE API --- */

router.get('/me', private.checkJWT, async (req, res) => {
  try {
    console.log("Email récupéré du token :", req.email);

    if (!req.email) {
      return res.status(400).json({ error: 'Email manquant dans la requête' });
    }

    const user = await User.findOne({ email: req.email }).select('name email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Erreur dans /me :', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
