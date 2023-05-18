const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = mongoose.model(process.env.USER_MODEL);
const ResponseUtils = require("../utils/response.utils");
const { setResponse } = require("../utils/response.utils");
const { response } = require("express");

const _createResponse = ResponseUtils.createResponse;
const _setResponse = ResponseUtils.setResponse;
const _sendResponse = ResponseUtils.sendResponse;


const getAll = function(req, res) {
    const response = _createResponse();
    User.find().exec()
        .then((users) => _setResponse(response, process.env.HTTP_OK, users))
        .catch((error) => _setResponse(response, process.env.HTTP_ERROR, { message: error.message }))
        .finally(() => _sendResponse(res, response));
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

const addOne = function(req, res) {
    const response = _createResponse();
    if (req.body && req.body.username && req.body.password) {
        _generateSalt()
            .then((salt) => _hashPassword(req.body.password, salt))
            .then((passwordHash) => _createUser(req, passwordHash))
            .then((user) => _setResponse(response, process.env.HTTP_OK, user))
            .catch((error) => setResponse(response, process.env.HTTP_ERROR, error.message))
            .finally(() => _sendResponse(res, response));
    } else {
        _setResponse(response, process.env.HTTP_BAD_REQUEST, { message: process.env.MISSING_REQUEST_BODY_MSG });
        _sendResponse(res, response);
    }
}


const _findUser = function(username) {
    return User.findOne({username: username}).exec();
}

const _comparePassword = function(password, encryptedPassword) {
    return bcrypt.compare(password, encryptedPassword);
}

const _isPasswordMatch = function(isMatch) {
    return new Promise((resolve, reject) => {
        if (isMatch) {
            resolve();
        } else {
            reject();
        }
    });
}

const getOne = function(req, res) {
    const response = _createResponse();
    if (req.body && req.body.username && req.body.password) {
        _findUser(req.body.username)
            .then((user) =>  _comparePassword(req.body.password, user.password))
            .then((isMatch) => _isPasswordMatch(isMatch))
            .then(() => _setResponse(response, process.env.HTTP_OK, {message: process.env.LOGIN_MESSAGE}))
            .catch(() => _setResponse(response, process.env.HTTP_UNAUTHORIZED, {message: process.env.HTTP_UNAUTHORIZED_MESSAGE}))
            .finally(() => _sendResponse(res, response));
    } else {
        _setResponse(response, process.env.HTTP_BAD_REQUEST, { message: process.env.MISSING_REQUEST_BODY_MSG });
        _sendResponse(res, response);
    }
}


module.exports = {
    getAll,
    register: addOne,
    login: getOne
}