const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

function mongoConnect() {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo successfully");
    }
    catch {
        console.log("Mongo error: " ,error)
        process.exit()
    }
}

module.exports = mongoConnect;