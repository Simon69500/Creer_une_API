const mongoose = require('mongoose');

const clientOptions = {
    useNewUrlParser : true ,
    dbName          : "apinode"
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, clientOptions)
        console.log('connected to MongoDB !');
    } catch (error) {
        console.log("Erreur de connexion MongoDB : ", error);
    }
}