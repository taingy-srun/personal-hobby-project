const mongoose = require("mongoose");
const callbackify = require("util").callbackify;
const Album = mongoose.model(process.env.ALBUM_MODEL);
const ObjectId = mongoose.Types.ObjectId; 

const _findWithCallback = callbackify(function(offset, count) {
    return Album.find().skip(offset).limit(count).exec();
});

const _findOneWithCallback = callbackify(function(id) {
    return Album.findOne(new ObjectId(id)).exec();
});

const _deleteOneWithCallback = callbackify(function(id) {
    return Album.findByIdAndDelete(new ObjectId(id)).exec();
});

const _insertOneWithCallback = callbackify(function(album) {
    return Album.create(album);
});

const _saveWithCallback = callbackify(function(album) {
    return album.save();
});

const _findAlbumSongsWithCallback = callbackify(function(id) {
    return Album.findOne(new ObjectId(id)).select(process.env.SONG_COLLECTION).exec();
});

const _updateSongWithCallback = callbackify(function(id) {
    return Album.findOne(new ObjectId(id)).select(process.env.SONG_COLLECTION).exec();
});

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

    _findWithCallback(offset, count, function(err, albums) {
        if (err) {
            _sendErrorResponse(res, err);
        } else {
            _sendResponse(res, process.env.HTTP_OK, albums);
        }
    });
};

const getOne = function(req, res) {
    _findOneWithCallback(req.params.id, function(err, album) {
        if (err) {
            _sendErrorResponse(res, err);
        } else if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            _sendResponse(res, process.env.HTTP_OK, album);
        }
    });
}

const deleteOne = function(req, res) {
    _deleteOneWithCallback(req.params.id, function(err, album) {
        if (err) {
            _sendErrorResponse(res, err);
        } else if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message : process.env.ALBUM_DELETED_MESSAGE});
        }
    });
}

const addOne = function(req, res) {
    const newAlbum = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        numberOfSongs: req.body.numberOfSongs,
        songs: req.body.songs
    }
    _insertOneWithCallback(newAlbum, function(err, album) {
        if (err) {
            _sendErrorResponse(res, err);
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message : process.env.ALBUM_ADDED_MESSAGE});
        }
    });
}

const _updateOne = function(req, res, updateOneCallback) {
    _findOneWithCallback(req.params.id, function(err, album) {
        if (err) {
            _sendErrorResponse(res, err);
        } else if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            updateOneCallback(req, res, album);
        }
    });
}

const _fullUpdateOne = function(req, res, album) {
    album.title = req.body.title;
    album.releaseDate = req.body.releaseDate;
    album.songs = req.body.songs

    _saveWithCallback(album, function(err, saved){
        if (err) {
            _sendErrorResponse(res, err);
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE});
        }
    });
}

const fullUpdateOne = function(req, res) {
    _updateOne(req, res, _fullUpdateOne);
}

const _partialUpdateOne = function(req, res, album) {
    if (req.body.title) { album.title = req.body.title; }
    if (req.body.releaseDate) { album.releaseDate = req.body.releaseDate; }
    if (req.body.songs) { album.songs = req.body.songs }

    _saveWithCallback(album, function(err, saved){
        if (err) {
            _sendErrorResponse(res, err);
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message: process.env.ALBUM_UPDATED_MESSAGE});
        }
    });
}

const partialUpdateOne = function(req, res) {
    _updateOne(req, res, _partialUpdateOne);
}

const getAlbumSongs = function(req, res) {
    _findAlbumSongsWithCallback(req.params.id, function(err, songs) {
        if (err) {
            _sendErrorResponse(res, err);
        } else if (!songs) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            _sendResponse(res, process.env.HTTP_OK, songs);
        }
    });
}

const getOneSong = function(req, res) {
    _findOneWithCallback(req.params.id, function(err, album) {   
        if (err) {
            _sendErrorResponse(res, err);
        } else if (album && album.songs.id(req.params.songId)) {
            _sendResponse(res, process.env.HTTP_OK, album.songs.id(req.params.songId));
        } else {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        }
    });
}

const _updateOneSong = function(req, res, updateOneSongCallback) {
    _updateSongWithCallback(req.params.id, function(err, album) {   
        if (err) {
            _sendErrorResponse(res, err);
        } else if (!album || !album.songs.id(req.params.songId)) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        } else {
            updateOneSongCallback(req, res, album);
        }
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
    _saveWithCallback(album, function(err, album) {
        if (err) {
            _sendErrorResponse(res, err);
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE});
        }
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
    _saveWithCallback(album, function(err, album) {
        if (err) {
            _sendErrorResponse(res, err);
        } else {
            _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_UPDATED_MESSAGE});
        }
    });
}

const deleteOneSong = function(req, res) {
    _findOneWithCallback(req.params.id, function(err, album) {   
        if (err) {
            _sendErrorResponse(res, err);
        } else if (album && album.songs.id(req.params.songId)) {
            const song = album.songs.id(req.params.songId);
            album.songs.remove(song);
            _saveWithCallback(album, function(err, album) {
                if (err) {
                    _sendErrorResponse(res, err);
                } else {
                    _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_DELETED_MESSAGE});
                }
            });
        } else {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
        }
    });
}

const addOneSong = function(req, res) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    _findOneWithCallback(req.params.id, function(err, album) {   
        if (err) {
            _sendErrorResponse(res, err);
        } else if (!album) {
            _sendResponse(res, process.env.HTTP_NOT_FOUND, {message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
        } else {
            album.songs.push(song);
            _saveWithCallback(album, function(err, album) {
                if (err) {
                    _sendErrorResponse(res, err);
                } else {
                    _sendResponse(res, process.env.HTTP_OK, {message: process.env.SONG_ADDED_MESSAGE});
                }
            });
        }
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