const router = require("express").Router();
const userController = require("../controllers/users.controller");

router.route("/")
    .post(userController.register);

router.route("/login")
    .post(userController.login);

module.exports = router;