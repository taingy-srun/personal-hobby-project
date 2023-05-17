const mongoose = require("mongoose");
const Album = mongoose.model(process.env.ALBUM_MODEL);

const _sendErrorResponse = function(res, err) {
    res.status(parseInt(process.env.HTTP_ERROR));
    res.json({message: err.message});
}

const _sendResponse = function(res, res_code, message) {
    res.status(parseInt(res_code));
    res.json(message);
}

const getAll = function(req, res) {
    let offset = process.env.DEFAULT_OFFSET;
    let count = process.env.DEFAULT_COUNT;
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (count > parseInt(process.env.MAX_COUNT)) {
        _sendResponse(res, process.env.HTTP_BAD_REQUEST, { message: process.env.HTTP_BAD_REQUEST_MESSAGE_EXCEED_COUNT });
        return;
    }

    Album.find().skip(offset).limit(count).sort({releaseDate: 1}).exec().then(function(albums) {
        _sendResponse(res, process.env.HTTP_OK, albums);
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
};

const getOne = function(req, res) {
    const id = req.params.id;
    Album.findById(id).exec().then(function(album) {
        if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            _sendResponse(res, process.env.HTTP_OK, album);
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const deleteOne = function(req, res) {
    const id = req.params.id;
    Album.findByIdAndDelete(id).exec().then(function(album) {
        if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message : process.env.ALBUM_DELETED_MESSAGE});
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const addOne = function(req, res) {
    const newAlbum = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        numberOfSongs: req.body.numberOfSongs,
        songs: req.body.songs
    }
    Album.create(newAlbum).then(function(album) {
        _sendResponse(res, process.env.HTTP_OK, {message : process.env.ALBUM_ADDED_MESSAGE});
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const _updateOne = function(req, res, updateOneCallback) {
    const id = req.params.id;
    Album.findById(id).exec().then(function(album) {
        if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            updateOneCallback(req, res, album);
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const _fullUpdateOne = function(req, res, album) {
    album.title = req.body.title;
    album.releaseDate = req.body.releaseDate;
    album.songs = req.body.songs

    album.save().then(function(saved){
        _sendResponse(res, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE});
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const fullUpdateOne = function(req, res) {
    _updateOne(req, res, _fullUpdateOne);
}

const _partialUpdateOne = function(req, res, album) {
    if (req.body.title) { album.title = req.body.title; }
    if (req.body.releaseDate) { album.releaseDate = req.body.releaseDate; }
    if (req.body.songs) { album.songs = req.body.songs }

    album.save().then(function(saved){
        _sendResponse(res, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE});
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const partialUpdateOne = function(req, res) {
    _updateOne(req, res, _partialUpdateOne);
}

const getAlbumSongs = function(req, res) {
    const id = req.params.id;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec().then(function(songs) {
        if (!songs) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            _sendResponse(res, process.env.HTTP_OK, songs);
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const getOneSong = function(req, res) {
    const id = req.params.id;
    Album.findById(id).exec().then(function(album) {
        if (album && album.songs.id(req.params.songId)) {
            _sendResponse(res, process.env.HTTP_OK, album.songs.id(req.params.songId));
        } else {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const _updateOneSong = function(req, res, updateOneSongCallback) {
    const id = req.params.id;
    Album.findById(id).select(process.env.SONG_COLLECTION).exec().then(function(album) {   
        if (!album || !album.songs.id(req.params.songId)) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        } else {
            updateOneSongCallback(req, res, album);
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const fullUpdateOneSong = function(req, res) {
    _updateOneSong(req, res, _fullUpdateOneSong);
}

const _fullUpdateOneSong = function(req, res, album) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    album.songs.id(req.params.songId).set(song);
    album.save().then(function(album) {
        _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE});
    }).catch(function(err){
        _sendErrorResponse(res, err);
    });
}

const partialUpdateOneSong = function(req, res) {
    _updateOneSong(req, res, _partialUpdateOneSong);
}

const _partialUpdateOneSong = function(req, res, album) {
    const song = album.songs.id(req.params.songId);
    if (req.body.title) { song.title = req.body.title }
    if (req.body.duration) { song.duration = req.body.duration }

    album.songs.id(req.params.songId).set(song);
    album.save().then(function(album) {
        _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE});
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const deleteOneSong = function(req, res) {
    const id = req.params.id;
    const songId = req.params.songId;
    Album.findById(id).exec().then(function(album) {
        if (album && album.songs.id(songId)) {
            const song = album.songs.id(songId);
            album.songs.remove(song);
            album.save().then(function(updatedAlbum) {
                _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_DELETED_MESSAGE});
            }).catch(function(err) {
                _sendErrorResponse(res, err);
            });
        } else {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
}

const addOneSong = function(req, res) {
    const id = req.params.id;
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }

    Album.findById(id).exec().then(function(album) {   
        if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            album.songs.push(song);
            album.save().then(function(album) {
                _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_ADDED_MESSAGE});
            }).catch(function(err) {
                _sendErrorResponse(res, err);
            });
        }
    }).catch(function(err) {
        _sendErrorResponse(res, err);
    });
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