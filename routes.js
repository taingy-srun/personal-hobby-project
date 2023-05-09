const router = require("express").Router();
const albumController = require("./controllers/album.controller");

router.route("/albums")
    .get(albumController.getAll)
    .post(albumController.addOne);

router.route("/albums/:id")
    .get(albumController.getOne)
    .put(albumController.fullUpdateOne)
    .patch(albumController.partialUpdateOne)
    .delete(albumController.deleteOne);

router.route("/albums/:id/songs")
    .get(albumController.getAlbumSongs)
    .post(albumController.addOneSong);

router.route("/albums/:id/songs/:songId")
    .get(albumController.getOneSong)
    .put(albumController.fullUpdateOneSong)
    .patch(albumController.partialUpdateOneSong)
    .delete(albumController.deleteOneSong);

module.exports = router;