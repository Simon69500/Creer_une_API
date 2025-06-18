const Catway = require('../models/catway');

// Récupérer tous les Catways
exports.getByAll = async (req, res, next) => {
    try {
        const catways = await Catway.find({});
        res.render('catway', { catways });
    } catch (error) {
        return res.status(500).send("Erreur serveur : " + error.message);
    }
};

// Récupérer un seul Catway par numéro 
exports.getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const catway = await Catway.findOne({ catwayNumber: id });

        if (!catway) {
            return res.status(404).send('Catway introuvable');
        }

        res.render('catway-detail', { catway });
    } catch (error) {
        return res.status(500).send("Erreur serveur : " + error.message);
    }
};

// Ajouter un Catway
exports.add = async (req, res, next) => {
    const { catwayNumber, catwayType, catwayState } = req.body;

    try {
        const exists = await Catway.findOne({ catwayNumber });

        if (exists) {
            return res.status(409).send("Catway déjà existant");
        }

        await Catway.create({ catwayNumber, catwayType, catwayState });
        res.redirect('/catways');
    } catch (error) {
        return res.status(500).send("Erreur serveur : " + error.message);
    }
};

// Modifier un Catway (uniquement état ici)
exports.update = async (req, res, next) => {
    const id = req.params.id;
    const { catwayState } = req.body;

    try {
        const catway = await Catway.findById(id);

        if (!catway) {
            return res.status(404).send("Catway introuvable");
        }

        catway.catwayState = catwayState;
        await catway.save();
        res.redirect('/catways');
    } catch (error) {
        return res.status(500).send("Erreur serveur : " + error.message);
    }
};

// Supprimer un Catway
exports.delete = async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Catway.deleteOne({ _id: id });

        if (result.deletedCount === 1) {
            return res.redirect('/catways');
        } else {
            return res.status(404).send("Catway introuvable");
        }
    } catch (error) {
        return res.status(500).send("Erreur serveur : " + error.message);
    }
};
