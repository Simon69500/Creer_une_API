const Catway = require("../models/catway");
/**
 * @module services/catways
 * @description Toutes les opérations de gestion des catways.
 */

/**
 * Récupère tous les catways.
 * @route GET /catways
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.getByAll = async (req, res, next) => {
  try {
    const catways = await Catway.find({});
    res.render("catway", { catways });
  } catch (error) {
    return res.status(500).send("Erreur serveur : " + error.message);
  }
};

/**
 * Récupère un catway par son numéro.
 * @route GET /catways/:id
 * @param {Object} req - Objet de requête contenant l'ID.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const catway = await Catway.findOne({ catwayNumber: id });

    if (!catway) {
      return res.status(404).send("Catway introuvable");
    }

    res.render("catway-detail", { catway });
  } catch (error) {
    return res.status(500).send("Erreur serveur : " + error.message);
  }
};

/**
 * Ajoute un nouveau catway.
 * @route POST /catways
 * @param {Object} req - Objet de requête contenant catwayNumber, catwayType, catwayState.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.add = async (req, res, next) => {
  const { catwayNumber, catwayType, catwayState } = req.body;

  try {
    const exists = await Catway.findOne({ catwayNumber });

    if (exists) {
      return res.status(409).send("Catway déjà existant");
    }

    await Catway.create({ catwayNumber, catwayType, catwayState });
    res.redirect("/catways");
  } catch (error) {
    return res.status(500).send("Erreur serveur : " + error.message);
  }
};

/**
 * Met à jour l'état d’un catway.
 * @route PUT /catways/:id
 * @param {Object} req - Objet de requête avec le nouvel état.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
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
    res.redirect("/catways");
  } catch (error) {
    return res.status(500).send("Erreur serveur : " + error.message);
  }
};

/**
 * Supprime un catway.
 * @route DELETE /catways/:id
 * @param {Object} req - Objet de requête contenant l’ID du catway.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction middleware suivante.
 */
exports.delete = async (req, res, next) => {
  const id = req.params.id;

  try {
    const result = await Catway.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      return res.redirect("/catways");
    } else {
      return res.status(404).send("Catway introuvable");
    }
  } catch (error) {
    return res.status(500).send("Erreur serveur : " + error.message);
  }
};
