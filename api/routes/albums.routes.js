const router = require("express").Router();
const albumController = require("../controllers/album.controller");

router.route("/")
    .get(albumController.getAll)
    .post(albumController.addOne);

router.route("/:id")
    .get(albumController.getOne)
    .put(albumController.fullUpdateOne)
    .patch(albumController.partialUpdateOne)
    .delete(albumController.deleteOne);

router.route("/:id/songs")
    .get(albumController.getAlbumSongs)
    .post(albumController.addOneSong);

router.route("/:id/songs/:songId")
    .get(albumController.getOneSong)
    .put(albumController.fullUpdateOneSong)
    .patch(albumController.partialUpdateOneSong)
    .delete(albumController.deleteOneSong);

module.exports = router;