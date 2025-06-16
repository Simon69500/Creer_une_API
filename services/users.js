const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

//Recuperer tous les User
exports.getByAll = async (req, res, next) => {
    try {
        const users = await User.find({}, )
        return res.status(200).json(users);
    } catch(error){
        return res.status(500).json(error);
    }
}

// Recuperer un User
exports.getByMail = async (req, res, next) => {
    const email = req.params.email

    try {
        const user = await User.findOne({email: email},);

        if(user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('user_not_found');
    }catch(error){
        return res.status(501).json(error);
    }
}

// Ajout d'un user 
exports.add = async (req, res, next) => {
  console.log("Données du formulaire :", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const user = await User.create({ name, email, password });
    delete user._doc.password;
    return res.status(201).json({user});

  } catch (error) {
    console.error("Erreur création user :", error);
    return res.status(500).json({ error: error.message });
  }
};



//Modifer un user
exports.update = async (req, res, next) => {
    const email = req.params.email
    const temp = ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        let user = await User.findOne({email: email});

        if(user){
            Object.keys(temp).forEach((key) =>{
                if(!!temp[key]){
                    user[key] = temp[key];
                }
            });
            await user.save();
            return res.status(201).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch(error) {
        return res.status(501).json(error);
    }
}

//Suprimer un User
exports.delete = async (req, res, next) => {
    const email = req.params.email

    try {
       const result = await User.deleteOne({email: email});

        if(result.deletedCount === 1){
            return res.status(204).json('User delete !');
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}

// Authentification de User
exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json('user_not_found_authenticate');
    }

    console.log('Hash en base:', user.password, '(longueur', user.password.length, ')');
    console.log('Type de password fourni:', typeof password, 'valeur:', `"${password}"`);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Résultat de bcrypt.compare:', passwordMatch);

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

    res.render('dashboard', { user });

  } catch (error) {
    console.error('Erreur dans authenticate:', error);
    return res.status(500).json({ error: error.message });
  }
};


// Logout User
exports.logout = async (req, res, next) => {
    
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'Strict',
    path: '/'
  });

    return res.status(200).json({message: 'logout_succes'});
}