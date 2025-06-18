const Reservation = require('../models/reservations');
const User = require('../models/users');

/**
 * @module services/reservation
 * @description Toutes les opérations de gestion des reservation.
 */

/**
 * Récupère toutes les réservations pour un catway donné.
 * @route GET /reservations/:id
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.getByAll = async (req, res, next) => {
    try {
        const catwayNumber = Number(req.params.id);
        const reservations = await Reservation.find({ catwayNumber }).populate('userId', 'name email');
        res.render('reservations', { reservations });
    } catch (error) {
        return res.status(500).json(error);
    }
};


/**
 * Récupère une réservation spécifique.
 * @route GET /reservations/:id/:idReservation
 * @param {Object} req - Objet de requête contenant l'ID du catway et de la réservation.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.getById = async (req, res, next) => {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;

    try {
        const reservation = await Reservation.findOne({ _id: reservationId, catwayNumber });

        if (!reservation) {
            return res.status(404).send('Réservation introuvable');
        }

        reservation.startDateFormatted = reservation.startDate.toLocaleDateString('fr-FR');
        reservation.endDateFormatted = reservation.endDate.toLocaleDateString('fr-FR');
        return res.render('reservation-detail', { reservation });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur serveur : " + error.message);
    }
};


/**
 * Crée une nouvelle réservation.
 * @route POST /reservations/:id
 * @param {Object} req - Objet de requête avec les données de réservation.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.add = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const temp = {
            catwayNumber: Number(req.params.id),
            clientName: user.name,
            boatName: req.body.boatName,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
            userId: user._id
        };

        const reservation = await Reservation.create(temp);

        if (reservation) {
            res.redirect(`/reservations`);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};


/**
 * Met à jour une réservation existante.
 * @route POST /reservations/:id/:idReservation
 * @param {Object} req - Objet de requête avec les nouvelles données.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.update = async (req, res, next) => {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;

    const temp = {
        catwayNumber: Number(req.params.id),
        clientName: req.body.clientName,
        clientEmail: req.email,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    };

    try {
        let reservation = await Reservation.findOne({ _id: reservationId, catwayNumber: catwayNumber });

        if (reservation) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    reservation[key] = temp[key];
                }
            });
            await reservation.save();
            return res.redirect(`/reservations`);
        }

        return res.status(404).json('reservation_not_found');
    } catch (error) {
        return res.status(500).json(error);
    }
};


/**
 * Supprime une réservation spécifique.
 * @route DELETE /reservations/:id/:idReservation
 * @param {Object} req - Objet de requête contenant l'ID du catway et de la réservation.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.delete = async (req, res, next) => {
    const catwayNumber = req.params.id;
    const reservationId = req.params.idReservation;

    try {
        const result = await Reservation.deleteOne({ _id: reservationId, catwayNumber: catwayNumber });

        if (result.deletedCount === 1) {
            return res.redirect(`/reservations`);
        } else {
            return res.status(404).json('reservation_not_found');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};
