const mongoose = require("mongoose");
require("../models/album.model");

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on(process.env.DB_ON_CONNECTED, function() {
    console.log(process.env.DB_ON_CONNECTED_MESSAGE, process.env.DB_NAME);
});

mongoose.connection.on(process.env.DB_ON_DISCONNECTED, function() {
    console.log(process.env.DB_ON_DISCONNECTED_MESSAGE, process.env.DB_NAME);
});

mongoose.connection.on(process.env.DB_ON_ERROR, function() {
    console.log(process.env.DB_ON_ERROR_MESSAGE, process.env.DB_NAME);
});