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

router.get('/dashboard', private.checkJWT, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email }).select('name email');
    const reservations = await Reservation.find({ userEmail: req.email });
    if (!user) {
      return res.status(404).json('user_not_found');
    }
    res.render('dashboard', { user, reservations });
  } catch (err) {
    console.error('Erreur dans /dashboard :', err);
    res.status(500).json({ error: "internal_server_error" });
  }
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

router.get('/users', private.checkJWT, async (req, res) => {
  try {
    const users = await User.find({});
    res.render('user', {users});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
