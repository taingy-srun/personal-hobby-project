const mongoose = require("mongoose");
require("../models/album.model");
const callbackify = require("util").callbackify;

const mongooseConnectWithCallback = callbackify(function(url) {
    return mongoose.connect(url);
});

const open = function() {
    mongooseConnectWithCallback(process.env.DB_URL, function(err, client) {
        if (get() == null) {
            if (err) {
                console.log("connection error: ", err);
            } else {
                console.log("connected to db"); 
            }
        } 
    });
}

const get = function() {
    return mongoose.connection;
}

module.exports = {
    open,
    get
}