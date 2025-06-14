const {default: mongoose} = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

//Recuperer tous les User
exports.getByAll = async (req, res, next) => {
    try {
        const user = await User.find({}, '-password -__v')
        return res.status(200).json(user);
    } catch(error){
        return res.status(500).json(error);
    }
}

// Recuperer un User
exports.getByMail = async (req, res, next) => {
    const email = req.params.email

    try {
        const user = await User.findByOne({email: email},'-password -__v');

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
    const temp = ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        let user = await User.create(temp)

        if(user) {
            return res.status(201).json(user);
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}

//Modifer un user
exports.update = async (req, res, next) => {
    const id = req.params.id
    const temp = ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        let user = await User.findOne({_id: id});

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
        await User.deleteOne({email: email});

        if(result.deleteCount === 1){
            return res.status(204).json('User delete !');
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}


// Authentification de User
exports.authenticate = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email: email}, '-__v -createdAt -updatedAt');
        if(user){
            bcrypt.compare(password, user.password, function(err, response){
                if(err){
                    throw new Error(err)
                }
                if(response){
                    delete user._doc.password;

                    const expiresIn = 24 * 60 * 60;
                    const token = jwt.sign({
                        user: user
                    },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                res.headers('Authorization', 'Bearer' + token);
                }

                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch(error) {
        return res.status(501).json(error);
    }
}

exports.logout = async (req, res, next) => {
    return res.status(200).json({message: 'logout_succes'});
}