const {default: mongoose} = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');


// Recuperer un User
exports.getById = async (req, res, next) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error:'invalid_user_id'});
    }

    try {
        const user = await User.findById(id);

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
        firstname: req.body.firstname,
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
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password
    });

    try {
        let user = await User.findOne({id: id});

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
    const id = req.params.id

    try {
        await User.deleteOne({id: id});

        if(user){
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

                    const expiresIn: 24 * 60 * 60;
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
