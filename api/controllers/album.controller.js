const { response } = require("express");
const mongoose = require("mongoose");
const Album = mongoose.model(process.env.ALBUM_MODEL);
const ResponseUtils = require("../utils/response.utils")

const _createResponse = ResponseUtils.createResponse;
const _setResponse = ResponseUtils.setResponse;
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

const _checkSongExist = function(song) {
    return new Promise((resolve, reject) => {
        if (!song) {
            reject({message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        } else {
            resolve(song);
        }
    });
}

const getAll = function(req, res) {
    const response = _createResponse();

    let offset = process.env.DEFAULT_OFFSET;
    let count = process.env.DEFAULT_COUNT;
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (count > parseInt(process.env.MAX_COUNT)) {
        _setResponse(response, process.env.HTTP_BAD_REQUEST, { message: process.env.HTTP_BAD_REQUEST_MESSAGE_EXCEED_COUNT });
        _sendResponse(res, response);
        return;
    }

    Album.find().skip(offset).limit(count).sort({releaseDate: 1}).exec()
        .then((albums) => _setResponse(response, process.env.HTTP_OK, albums))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, {message: error.message}))
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
    const newAlbum = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        numberOfSongs: req.body.numberOfSongs,
        songs: req.body.songs
    }
    Album.create(newAlbum)
        .then((album) => _setResponse(response,process.env.HTTP_OK, {message: process.env.ALBUM_ADDED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, error.message))
        .finally(() => _sendResponse(res, response));
}

const _updateOne = function(req, res, updateOneCallback) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => updateOneCallback(req, res, album, response))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const _fullUpdateOne = function(req, res, album, response) {
    album.title = req.body.title;
    album.releaseDate = req.body.releaseDate;
    album.songs = req.body.songs

    album.save()
        .then((album) => _setResponse(response, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, error))
        .finally(() => _sendResponse(res, response));
}

const fullUpdateOne = function(req, res) {
    _updateOne(req, res, _fullUpdateOne);
}

const _partialUpdateOne = function(req, res, album, response) {
    if (req.body.title) { album.title = req.body.title; }
    if (req.body.releaseDate) { album.releaseDate = req.body.releaseDate; }
    if (req.body.songs) { album.songs = req.body.songs }

    album.save()
        .then((album) => _setResponse(response, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, error))
        .finally(() => _sendResponse(res, response));
}

const partialUpdateOne = function(req, res) {
    _updateOne(req, res, _partialUpdateOne);
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
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _checkSongExist(album.songs.id(req.params.songId)))
        .then((song) => _setResponse(response, process.env.HTTP_OK, song))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const _updateOneSong = function(req, res, updateOneSongCallback) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _checkSongExist(album.songs.id(req.params.songId)))
        .then((song) => updateOneSongCallback(req, res, song, response))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const fullUpdateOneSong = function(req, res) {
    _updateOneSong(req, res, _fullUpdateOneSong);
}

const _fullUpdateOneSong = function(req, res, album, response) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    album.songs.id(req.params.songId).set(song);
    album.save()
        .then((album) => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, error))
        .finally(() => _sendResponse(res, response));
}

const partialUpdateOneSong = function(req, res) {
    _updateOneSong(req, res, _partialUpdateOneSong);
}

const _partialUpdateOneSong = function(req, res, album) {
    const song = album.songs.id(req.params.songId);
    if (req.body.title) { song.title = req.body.title }
    if (req.body.duration) { song.duration = req.body.duration }

    album.songs.id(req.params.songId).set(song);
    album.save()
        .then((album) => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, error))
        .finally(() => _sendResponse(res, response));
}

const _deleteSongFromAlbum = function(album, song) {
    album.songs.remove(song);
    return album.save();
}

const deleteOneSong = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _deleteSongFromAlbum(album, album.songs.id(songId)))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_DELETED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_NOT_FOUND, error))
        .finally(() => _sendResponse(res, response));
}

const _addSongToAlbum = function(album, req) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    album.songs.push(song);
    return album.save();
}

const addOneSong = function(req, res) {
    const response = _createResponse();
    const id = req.params.id;
    Album.findById(id).exec()
        .then((album) => _checkAlbumExist(album))
        .then((album) => _addSongToAlbum(album, req))
        .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.SONG_ADDED_MESSAGE}))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, error))
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