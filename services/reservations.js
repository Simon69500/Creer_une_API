const Reservation = require('../models/reservations');

//Recuperer tous la liste des Reservations
exports.getByAll = async (req, res, next) => {
    try {
        const reservation = await Reservation.find({})
        return res.status(200).json(reservation);
    } catch(error){
        return res.status(500).json(error);
    }
}

// Recuperer une Reservation
exports.getById = async (req, res, next) => {
    const catwayNumber = req.params.id;
    const reservationId = req.params.idReservation;
    const userEmail = req.mail;

    try {
        const reservation = await Reservation.findOne({ _id: reservationId, catwayNumber: catwayNumber, clientEmail: userEmail});

        if(reservation) {
            return res.status(200).json({message: 'Vos Réservations : ',reservation});
        }
        return res.status(404).json('reservation_not_found');
    }catch(error){
        return res.status(501).json(error);
    }
}

// Ajout d'une Reservation
exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    });

    try {
        let reservation = await Reservation.create(temp)

        if(reservation) {
            return res.status(201).json(reservation);
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}

//Modifer une Reservation
exports.update = async (req, res, next) => {
    const catwayNumber = req.params.id;
    const reservationId = req.params._idReservation;

    const temp = ({
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
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
            return res.status(200).json(reservation);
        }

        return res.status(404).json('reservation_not_found');
    } catch(error) {
        return res.status(501).json(error);
    }
}

//Suprimer une Reservation
exports.delete = async (req, res, next) => {
    const catwayNumber = req.params.id;
    const reservationId = req.params.idReservation;

    try {
       const result = await Reservation.deleteOne({_id: reservationId, catwayNumber: catwayNumber});

        if(result.deletedCount === 1){
            return res.status(204).json('reservation delete !');
        } else {
            return res.status(404).json('reservation_not_found')
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}