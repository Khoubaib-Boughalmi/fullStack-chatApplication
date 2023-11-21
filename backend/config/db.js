const mongoose = require("mongoose");

const DB_connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log("DB connected");
    } catch (error) {
        console.log("DB Failed " + error);
        exit(1);
    }
}

module.exports = { DB_connect }