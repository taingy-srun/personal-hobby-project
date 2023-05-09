const connection = require("../data/dbconnection").get();
const mongoose = require("mongoose");
const callbackify = require("util").callbackify;
const Album = mongoose.model(process.env.ALBUM_MODEL);
const ObjectId = mongoose.Types.ObjectId; 

const findWithCallback = callbackify(function(offset, count) {
    return Album.find().skip(offset).limit(count).exec();
});

const findOneWithCallback = callbackify(function(id) {
    return Album.findOne(new ObjectId(id)).exec();
});

const deleteOneWithCallback = callbackify(function(id) {
    return Album.findByIdAndDelete(new ObjectId(id)).exec();
});

const insertOneWithCallback = callbackify(function(album) {
    return Album.create(album);
});

const updateOneWithCallback = callbackify(function(id, album) {
    return Album.findOneAndUpdate(new ObjectId(id), album);
});

const findAlbumSongsWithCallback = callbackify(function(id) {
    return Album.findOne(new ObjectId(id)).select(process.env.SONG_COLLECTION).exec();
});

const updateSongWithCallback = callbackify(function(id) {
    return Album.findOne(new ObjectId(id)).select(process.env.SONG_COLLECTION).exec();
});

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
        res.status(parseInt(process.env.HTTP_BAD_REQUEST));
        res.json({message: process.env.HTTP_BAD_REQUEST_MESSAGE_EXCEED_COUNT});
        return;
    }

    findWithCallback(offset, count, function(err, albums) {
        if (err) {
            console.log(err);
            res.status(parseInt(process.env.HTTP_ERROR));
            res.json({message: process.env.HTTP_ERROR_MESSAGE});
        } else {
            res.status(parseInt(process.env.HTTP_OK));
            res.json(albums);
        }
    });
};


const getOne = function(req, res) {
    findOneWithCallback(req.params.id, function(err, album) {
        if (err) {
            console.log(err);
            res.status(parseInt(process.env.HTTP_ERROR));
            res.json({message: process.env.HTTP_ERROR_MESSAGE});
        } else {
            if (album) {
                res.status(parseInt(process.env.HTTP_OK));
                res.json(album);
            } else {
                res.status(parseInt(process.env.HTTP_NOT_FOUND));
                res.json({message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
            }
        }
    });
}


const deleteOne = function(req, res) {
    deleteOneWithCallback(req.params.id, function(err, album) {
        if (err) {
            console.log(err);
            res.status(parseInt(process.env.HTTP_ERROR));
            res.json({message: process.env.HTTP_ERROR_MESSAGE});
        } else {
            if (!album) {
                res.status(parseInt(process.env.HTTP_NOT_FOUND));
                res.json({message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
            } else {
                res.status(parseInt(process.env.HTTP_OK));
                res.json({message : process.env.HTTP_OK_MESSAGE});
            }
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
    insertOneWithCallback(newAlbum, function(err, album) {
        if (err) {
            console.log(err.message);
            res.status(parseInt(process.env.HTTP_BAD_REQUEST));
            res.json({message: err.message});
        } else {
            res.status(parseInt(process.env.HTTP_OK));
            res.json({message : process.env.HTTP_OK_MESSAGE});
        }
    });
}

const fullUpdateOne = function(req, res) {
    const updateAlbum = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        numberOfSongs: req.body.numberOfSongs,
        songs:  req.body.songs
    }
    updateOneWithCallback(req.params.id, updateAlbum, function(err, album) {
        if (err) {
            console.log(err.message);
            res.status(parseInt(process.env.HTTP_BAD_REQUEST));
            res.json({message: err.message});
        } else {
            res.status(parseInt(process.env.HTTP_OK));
            res.json({message : process.env.HTTP_OK_MESSAGE});
        }
    });
}

const partialUpdateOne = function(req, res) {
    const updateAlbum = {
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        numberOfSongs: req.body.numberOfSongs,
        songs:  req.body.songs
    }
    updateOneWithCallback(req.params.id, updateAlbum, function(err, album) {
        if (err) {
            console.log(err.message);
            res.status(parseInt(process.env.HTTP_BAD_REQUEST));
            res.json({message: err.message});
        } else {
            res.status(parseInt(process.env.HTTP_OK));
            res.json({message : process.env.HTTP_OK_MESSAGE});
        }
    });
}

const getAlbumSongs = function(req, res) {
    findAlbumSongsWithCallback(req.params.id, function(err, songs) {
        if (err) {
            console.log(err);
            res.status(parseInt(process.env.HTTP_ERROR));
            res.json({message: process.env.HTTP_ERROR_MESSAGE});
        } else {
            if (songs) {
                res.status(parseInt(process.env.HTTP_OK));
                res.json(songs);
            } else {
                res.status(parseInt(process.env.HTTP_NOT_FOUND));
                res.json({message: process.env.HTTP_ALBUM_NOT_FOUND_MESSAGE});
            }
        }
    });
}

const getOneSong = function(req, res) {
    findOneWithCallback(req.params.id, function(err, album) {   
        if (err) {
            console.log(err);
            res.status(parseInt(process.env.HTTP_ERROR));
            res.json({message: process.env.HTTP_ERROR_MESSAGE});
        } else {
            if (album && album.songs.id(req.params.songId)) {
                res.status(parseInt(process.env.HTTP_OK));
                res.json(album.songs.id(req.params.songId));
            } else {
                res.status(parseInt(process.env.HTTP_NOT_FOUND));
                res.json({message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
            }
        }
    });
}

const updateOneSong = function(req, res) {
    const song = {
        title: req.body.title,
        duration: req.body.duration
    }
    updateSongWithCallback(req.params.id, function(err, album) {   
        if (err) {
            console.log(err);
            res.status(parseInt(process.env.HTTP_ERROR));
            res.json({message: process.env.HTTP_ERROR_MESSAGE});
        } else {
            if (album && album.songs.id(req.params.songId)) {
                /// to be updated
                album.songs.id(req.params.songId).save(song);
                res.status(parseInt(process.env.HTTP_OK));
                res.json(album);
            } else {
                res.status(parseInt(process.env.HTTP_NOT_FOUND));
                res.json({message: process.env.HTTP_SONG_NOT_FOUND_MESSAGE});
            }
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
    updateOneSong
}