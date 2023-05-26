const mongoose = require("mongoose");
const Album = mongoose.model(process.env.ALBUM_MODEL);
const ResponseUtils = require("../utils/response.utils")

const _createResponse = ResponseUtils.createResponse;
const _setResponse = ResponseUtils.setResponse;
const _setErrorResponse = ResponseUtils.setErrorResponse;
const _sendResponse = ResponseUtils.sendResponse;

const _checkAlbumExist = function(album) {
    return new Promise((resolve, reject) => {
        if (!album) {
            reject({message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            resolve(album);
        }
    });
}

const _checkSongExist = function(album, songId) {
    return new Promise((resolve, reject) => {
        if (!album.songs.id(songId)) {
            reject({message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        } else {
            resolve(album);
        }
    });
}

const _updateOne = function(req, res, updateOneCallback) {
    const response = _createResponse();
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _checkSongExist(album, songId))
        .then((album) => updateOneCallback(req, album))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const _fullUpdateOne = function(req, album) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    album.songs.id(req.params.songId).set(song);
    return album.save();
}

const fullUpdateOne = function(req, res) {
    _updateOne(req, res, _fullUpdateOne);
}

const _partialUpdateOne = function(req, album) {
    const song = album.songs.id(req.params.songId);
    if (req.body.title) { song.title = req.body.title }
    if (req.body.duration) { song.duration = req.body.duration }

    album.songs.id(req.params.songId).set(song);
    return album.save();
}

const partialUpdateOne = function(req, res) {
    _updateOne(req, res, _partialUpdateOne);
}

const _addSongToAlbum = function(album, req) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    album.songs.push(song);
    return album.save();
}

const _deleteSongFromAlbum = function(album, songId) {
    const song = album.songs.id(songId);
    album.songs.remove(song);
    return album.save();
}

const getAll = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec()
        .then((album) => _checkAlbumExist(album))
        .then((songs) => _setResponse(response, process.env.HTTP_OK, songs))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const getOne = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _checkSongExist(album, songId))
        .then((album) => _setResponse(response, process.env.HTTP_OK, album.songs.id(songId)))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const addOne = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _addSongToAlbum(album, req))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_ADDED_MESSAGE}))
        .catch((error) => _setErrorResponse(response, error))
        .finally(() => _sendResponse(res, response));
}

const deleteOne = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _checkSongExist(album, songId))
        .then((album) => _deleteSongFromAlbum(album, songId))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_DELETED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}


module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdateOne,
    partialUpdateOne,
    deleteOne
}