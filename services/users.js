const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Récupérer tous les utilisateurs.
 * @route GET /users
 * @returns {View} - Rend la vue 'users' avec la liste des utilisateurs.
 */
exports.getByAll = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.render('users', { users });
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Récupérer un utilisateur par email.
 * @route GET /users/:email
 * @param {string} req.params.email - Email de l'utilisateur
 * @returns {View|Error} - Rend la vue 'user-edit' si trouvé, sinon erreur 404.
 */
exports.getByMail = async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.render('user-edit', { user });
    }
    return res.status(404).json('user_not_found');
  } catch (error) {
    return res.status(501).json(error);
  }
};

/**
 * Ajouter un nouvel utilisateur.
 * @route POST /users
 * @body {string} name - Nom
 * @body {string} email - Email
 * @body {string} password - Mot de passe
 * @returns {Redirect|Error}
 */
exports.add = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const user = await User.create({ name, email, password });
    delete user._doc.password;
    return res.redirect('/?created=true');
  } catch (error) {
    console.error("Erreur création user :", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Mettre à jour un utilisateur.
 * @route PUT /users
 * @body {string} oldEmail - Ancien email
 * @body {string} name - Nouveau nom
 * @body {string} email - Nouvel email
 * @body {string} password - Nouveau mot de passe (optionnel)
 * @returns {Redirect|Error}
 */
exports.update = async (req, res, next) => {
  const oldEmail = req.body.oldEmail;
  const { name, email: newEmail, password } = req.body;

  try {
    let user = await User.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json('user_not_found');
    }

    if (newEmail && newEmail !== oldEmail) {
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(409).json({ error: 'email_already_in_use' });
      }
      user.email = newEmail;
    }

    user.name = name || user.name;
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return res.redirect('/users');
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * Supprimer un utilisateur par email.
 * @route DELETE /users/:email
 * @param {string} req.params.email - Email de l'utilisateur
 * @returns {Redirect|Error}
 */
exports.delete = async (req, res, next) => {
  const email = req.params.email;
  try {
    const result = await User.deleteOne({ email });
    if (result.deletedCount === 1) {
      return res.redirect('/users');
    } else {
      return res.status(404).json({ message: 'user_not_found' });
    }
  } catch (error) {
    return res.status(501).json(error);
  }
};

/**
 * Authentifier un utilisateur et générer un token JWT.
 * @route POST /login
 * @body {string} email
 * @body {string} password
 * @returns {Redirect|Error}
 */
exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json('user_not_found_authenticate');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).json('wrong_credentials');
    }

    delete user._doc.password;

    const expiresIn = 24 * 60 * 60;
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn });

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: expiresIn * 1000
    });

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Erreur dans authenticate:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Déconnexion de l'utilisateur.
 * @route GET /logout
 * @returns {JSON} - Message de confirmation.
 */
exports.logout = async (req, res, next) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'Strict',
    path: '/'
  });
  return res.status(200).json({ message: 'logout_succes' });
};
