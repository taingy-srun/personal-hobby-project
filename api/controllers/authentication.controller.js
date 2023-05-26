
const jwt = require("jsonwebtoken");
const util = require("util");

module.exports.authenticate = function(req, res, next) {
   if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const jwtVerifyWithPromise = util.promisify(jwt.verify);
    jwtVerifyWithPromise(token, process.env.TOKEN_SECRET)
        .then(() => next())
        .catch((error) => {
            console.log(error);
            res.status(parseInt(process.env.HTTP_FORBIDDEN)).json(process.env.HTTP_UNAUTHORIZED_MESSAGE);
        });
   } else {
        res.status(parseInt(process.env.HTTP_UNAUTHORIZED)).json(process.env.HTTP_UNAUTHORIZED_MESSAGE);
   }
}