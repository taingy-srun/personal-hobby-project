const { response } = require("express");
const mongoose = require("mongoose");
const Album = mongoose.model(process.env.ALBUM_MODEL);
const ResponseUtils = require("../utils/response.utils")

const _createResponse = ResponseUtils.createResponse;
const _setResponse = ResponseUtils.setResponse;
const _setResponseCode = ResponseUtils.setResponseCode;
const _setErrorResponse = ResponseUtils.setErrorResponse;
const _sendResponse = ResponseUtils.sendResponse;

const _checkPagination = function(req, response) {
    return new Promise((resolve, reject) => {
        let offset = parseInt(process.env.DEFAULT_OFFSET);
        let count = parseInt(process.env.DEFAULT_COUNT);
        if (req.query && req.query.offset) {
            offset = parseInt(req.query.offset);
        }
        if (req.query && req.query.count) {
            count = parseInt(req.query.count);
        }
        if (count > parseInt(process.env.MAX_COUNT)) {
            _setResponseCode(response, process.env.HTTP_BAD_REQUEST);
            reject({message: process.env.HTTP_BAD_REQUEST_MESSAGE_EXCEED_COUNT});
        } else {
            resolve({offset: offset, count: count});
        }
    });
}

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

const _findAll = function(offset, count) {
    return Album.find().skip(offset).limit(count).sort({releaseDate: parseInt(process.env.ORDER_ASC)}).exec();
}

const _createAlbum = function(req) {
    const newAlbum = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        songs: req.body.songs
    }
    return Album.create(newAlbum);
}

const getAll = function(req, res) {
    const response = _createResponse();
    _checkPagination(req, response)
        .then((pagination) => _findAll(pagination.offset, pagination.count))
        .then((albums) => _setResponse(response, process.env.HTTP_OK, albums))
        .catch((error) => _setErrorResponse(response, error))
        .finally(() => _sendResponse(res, response));
};

const getOne = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _setResponse(response, process.env.HTTP_OK, album))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const deleteOne = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findByIdAndDelete(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _setResponse(response, process.env.HTTP_OK, {message : process.env.ALBUM_DELETED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const addOne = function(req, res) {
    const response = _createResponse();
    _createAlbum(req)
        .then((album) => _setResponse(response,process.env.HTTP_OK, {message: process.env.ALBUM_ADDED_MESSAGE}))
        .catch((error) => _setErrorResponse(response, error))
        .finally(() => _sendResponse(res, response));
}

const _updateOne = function(req, res, updateOneCallback) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => updateOneCallback(req, album))
        .then((album) => _setResponse(response, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const _fullUpdateOne = function(req, album) {
    album.title = req.body.title;
    album.releaseDate = req.body.releaseDate;
    album.songs = req.body.songs

    return album.save();
}

const fullUpdateOne = function(req, res) {
    _updateOne(req, res, _fullUpdateOne);
}

const _partialUpdateOne = function(req, album) {
    if (req.body.title) { album.title = req.body.title; }
    if (req.body.releaseDate) { album.releaseDate = req.body.releaseDate; }
    if (req.body.songs) { album.songs = req.body.songs }

    return album.save();
}

const partialUpdateOne = function(req, res) {
    _updateOne(req, res, _partialUpdateOne);
}

const _updateOneSong = function(req, res, updateOneSongCallback) {
    const response = _createResponse();
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _checkSongExist(album, songId))
        .then((album) => updateOneSongCallback(req, album))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const _fullUpdateOneSong = function(req, album) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    album.songs.id(req.params.songId).set(song);
    return album.save();
}

const fullUpdateOneSong = function(req, res) {
    _updateOneSong(req, res, _fullUpdateOneSong);
}

const _partialUpdateOneSong = function(req, album) {
    const song = album.songs.id(req.params.songId);
    if (req.body.title) { song.title = req.body.title }
    if (req.body.duration) { song.duration = req.body.duration }

    album.songs.id(req.params.songId).set(song);
    return album.save();
}

const partialUpdateOneSong = function(req, res) {
    _updateOneSong(req, res, _partialUpdateOneSong);
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

const getAlbumSongs = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec()
        .then((album) => _checkAlbumExist(album))
        .then((songs) => _setResponse(response, process.env.HTTP_OK, songs))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const getOneSong = function(req, res) {
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

const addOneSong = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _addSongToAlbum(album, req))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_ADDED_MESSAGE}))
        .catch((error) => _setErrorResponse(response, error))
        .finally(() => _sendResponse(res, response));
}

const deleteOneSong = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
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
    deleteOne,
    getAlbumSongs,
    getOneSong,
    addOneSong,
    fullUpdateOneSong,
    partialUpdateOneSong,
    deleteOneSong
}