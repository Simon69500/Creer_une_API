const Catway = require('../models/catway');

//Recuperer tous les Catways
exports.getByAll = async (req, res, next) => {
    try {
        const catway = await Catway.find({})
        return res.status(200).json(catway);
    } catch(error){
        return res.status(500).json(error);
    }
}

// Recuperer un Catways
exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        const catway = await Catway.findOne({catwayNumber: id});

        if(catway) {
            return res.status(200).json(catway);
        }
        return res.status(404).json('catway_not_found');
    }catch(error){
        return res.status(501).json(error);
    }
}

// Ajout d'un Catway
exports.add = async (req, res, next) => {
    const temp = ({
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    });

    try {
        let catway = await Catway.create(temp)

        if(catway) {
            return res.status(201).json(catway);
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}

//Modifer un Catway
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        catwayState: req.body.catwayState
    });

    try {
        let catway = await Catway.findOne({catwayNumber: id});

        if(catway){
            Object.keys(temp).forEach((key) =>{
                if(!!temp[key]){
                    catway[key] = temp[key];
                }
            });
            await catway.save();
            return res.status(200).json(catway);
        }

        return res.status(404).json('catway_not_found');
    } catch(error) {
        return res.status(501).json(error);
    }
}

//Suprimer un Catway
exports.delete = async (req, res, next) => {
    const id = req.params.id

    try {
        await Catway.deleteOne({_id: id});

        if(result.deletedCount === 1){
            return res.status(204).json('Catway delete !');
        } else {
            return res.status(404).json('catway_not_found')
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}