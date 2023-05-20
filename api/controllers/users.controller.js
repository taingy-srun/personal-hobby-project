const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const User = mongoose.model(process.env.USER_MODEL);
const ResponseUtils = require("../utils/response.utils");

const _createResponse = ResponseUtils.createResponse;
const _setResponse = ResponseUtils.setResponse;
const _setResponseCode = ResponseUtils.setResponseCode;
const _setErrorResponse = ResponseUtils.setErrorResponse;
const _sendResponse = ResponseUtils.sendResponse;

const _checkRequestBody = function(req, response) {
    return new Promise((resolve, reject) => {
        if (req.body && req.body.username && req.body.password) {
            resolve();
        } else {
            _setResponseCode(response, process.env.HTTP_BAD_REQUEST);
            reject({message: process.env.MISSING_REQUEST_BODY_MSG});
        }
    });
}

const _generateSalt = function() {
    const saltRound = parseInt(process.env.SALT_ROUND);
    return bcrypt.genSalt(saltRound);
}

const _hashPassword = function(password, salt) {
    return bcrypt.hash(password, salt);
}

const _createUser = function(req, passwordHash) {
    const newUser = {
        name: req.body.name,
        username: req.body.username,
        password: passwordHash
    }
    return User.create(newUser);
}

const _findUser = function(username) {
    return User.findOne({username: username}).exec();
}

const _comparePassword = function(password, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
            .then((isMatch) => resolve({isMatch: isMatch, user: user}))
            .catch((error) => reject(error));
    })
}

const _isPasswordMatch = function(isMatch, user) {
    return new Promise((resolve, reject) => {
        if (isMatch) {
            resolve(user);
        } else {
            reject();
        }
    });
}

const _generateToken = function(user) {
    const sign = util.promisify(jwt.sign);
    return new Promise((resolve, reject) => {
        sign({name: user.name}, process.env.TOKEN_SECRET, {expiresIn: parseInt(process.env.TOKEN_EXPIRE_IN)})
            .then((token) => resolve({token: token, user: user}))
            .catch((error) => reject(error));
    });
}

const addOne = function(req, res) {
    const response = _createResponse();
    _checkRequestBody(req, response)
        .then(() => _generateSalt())
        .then((salt) => _hashPassword(req.body.password, salt))
        .then((passwordHash) => _createUser(req, passwordHash))
        .then((user) => _setResponse(response, process.env.HTTP_OK, user))
        .catch((error) => _setErrorResponse(response, error))
        .finally(() => _sendResponse(res, response));
}

const getOne = function(req, res) {
    const response = _createResponse();
    _checkRequestBody(req, response)
        .then(() => _findUser(req.body.username))
        .then((user) =>  _comparePassword(req.body.password, user))
        .then(({isMatch, user}) => _isPasswordMatch(isMatch, user))
        .then((user) => _generateToken(user))
        .then(({token, user}) => _setResponse(response, process.env.HTTP_OK, {name: user.name, token: token}))
        .catch(() => _setResponse(response, process.env.HTTP_UNAUTHORIZED, {message: process.env.HTTP_UNAUTHORIZED_MESSAGE}))
        .finally(() => _sendResponse(res, response));
}


module.exports = {
    register: addOne,
    login: getOne
}