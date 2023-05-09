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
    .get(albumController.getAlbumSongs);

router.route("/albums/:id/songs/:songId")
    .get(albumController.getOneSong)
    .put(albumController.updateOneSong);

module.exports = router;