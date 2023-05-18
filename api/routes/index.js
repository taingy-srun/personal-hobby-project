const router = require("express").Router();
const albumRouter = require("./albums.routes");
const userRouter = require("./users.routes");

router.use("/albums", albumRouter);
router.use("/users", userRouter);

module.exports = router;