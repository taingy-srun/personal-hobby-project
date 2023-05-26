const router = require("express").Router();
const albumController = require("../controllers/album.controller");
const songController = require("../controllers/song.controller");
const authenticationController = require("../controllers/authentication.controller");

router.route("/")
    .get(albumController.getAll)
    .post(authenticationController.authenticate, albumController.addOne);

router.route("/:id")
    .get(albumController.getOne)
    .put(authenticationController.authenticate, albumController.fullUpdateOne)
    .patch(authenticationController.authenticate, albumController.partialUpdateOne)
    .delete(authenticationController.authenticate, albumController.deleteOne);

router.route("/:id/songs")
    .get(songController.getAll)
    .post(authenticationController.authenticate, songController.addOne);

router.route("/:id/songs/:songId")
    .get(songController.getOne)
    .put(authenticationController.authenticate, songController.fullUpdateOne)
    .patch(authenticationController.authenticate, songController.partialUpdateOne)
    .delete(authenticationController.authenticate, songController.deleteOne);

module.exports = router;