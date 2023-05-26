const router = require("express").Router();
const albumRouter = require("./albums.routes");
const userRouter = require("./users.routes");

router.use(process.env.ALBUMS_ENDPOINT, albumRouter);
router.use(process.env.USERS_ENDPOINT, userRouter);

module.exports = router;