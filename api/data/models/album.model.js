const mongoose = require("mongoose");
const songSchema = require("./song.model").songSchema;

const albumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    songs: [songSchema]
});

const albumModel = mongoose.model(process.env.ALBUM_MODEL, albumSchema, process.env.ALBUM_COLLECTION);

module.exports = {
    albumSchema,
    albumModel,
}