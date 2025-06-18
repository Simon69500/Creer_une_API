const Reservation = require('../models/reservations');
const mongoose = require('mongoose'); 


//Recuperer tous la liste des Reservations
exports.getByAll = async (req, res, next) => {
    try {
        const catwayNumber = Number(req.params.id)
        const reservations = await Reservation.find({ catwayNumber });
        res.render('reservations', { reservations });
    } catch(error){
        return res.status(500).json(error);
    }
}

//Recuperer une Reservations
exports.getById = async (req, res, next) => {

    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;


    const reservation = await Reservation.findOne({ _id: reservationId, catwayNumber });


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

// Ajout d'une Reservation
exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: Number(req.params.id),
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),

    });

    try {
        let reservation = await Reservation.create(temp)

        if(reservation) {
            res.redirect(`/reservations`);
        }
    } catch(error) {
        return res.status(500).json(error);
    }
}

//Modifer une Reservation
exports.update = async (req, res, next) => {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;

    const temp = ({
        catwayNumber: Number(req.params.id),
        clientName: req.body.clientName,
        clientEmail: req.email,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });

    try {
        let reservation = await Reservation.findOne({_id: reservationId, catwayNumber: catwayNumber});

        if(reservation){
            Object.keys(temp).forEach((key) =>{
                if(!!temp[key]){
                    reservation[key] = temp[key];
                }
            });
            await reservation.save();
            res.redirect(`/catways/${catwayNumber}/reservations`);
        }

        return res.status(404).json('reservation_not_found');
    } catch(error) {
        return res.status(500).json(error);
    }
}

//Suprimer une Reservation
exports.delete = async (req, res, next) => {
    const catwayNumber = req.params.id;
    const reservationId = req.params.idReservation;

    try {
       const result = await Reservation.deleteOne({_id: reservationId, catwayNumber: catwayNumber});

        if(result.deletedCount === 1){
            res.redirect(`/catways/${catwayNumber}/reservations`);
        } else {
            return res.status(404).json('reservation_not_found')
        }
    } catch(error) {
        return res.status(500).json(error);
    }
}