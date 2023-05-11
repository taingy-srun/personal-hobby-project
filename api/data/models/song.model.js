const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: Number
    }
});

module.exports = {
    songSchema 
}
