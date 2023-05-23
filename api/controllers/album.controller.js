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
        } else if (isNaN(offset) || isNaN(count)) {
            _setResponseCode(response, process.env.HTTP_BAD_REQUEST);
            reject({message: process.env.OFFSET_COUNT_MUST_BE_NUMBER_MSG});
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

module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdateOne,
    partialUpdateOne,
    deleteOne
}