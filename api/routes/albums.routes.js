const router = require("express").Router();
const albumController = require("../controllers/album.controller");
const songController = require("../controllers/song.controller");

router.route("/")
    .get(albumController.getAll)
    .post(albumController.addOne);

router.route("/:id")
    .get(albumController.getOne)
    .put(albumController.fullUpdateOne)
    .patch(albumController.partialUpdateOne)
    .delete(albumController.deleteOne);

router.route("/:id/songs")
    .get(songController.getAll)
    .post(songController.addOne);

router.route("/:id/songs/:songId")
    .get(songController.getOne)
    .put(songController.fullUpdateOne)
    .patch(songController.partialUpdateOne)
    .delete(songController.deleteOne);

module.exports = router;