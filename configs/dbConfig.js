const mongoose = require('mongoose');

const db = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Db is succesfully connected!!🚀');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = db;