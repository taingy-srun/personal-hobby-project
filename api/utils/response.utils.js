const createResponse = function(status, message) {
    const response = {
        status: status,
        message: message
    }
    return response;
}

const setResponse = function(response, status, message) {
    response.status = status;
    response.message = message;
}

const setResponseCode = function(response, status) {
    response.status = status;
}

const setErrorResponse = function(response, message) {
    response.status = response.status ? response.status : process.env.HTTP_ERROR;
    response.message = message;
}

const sendResponse = function(res, response) {
    res.status(parseInt(response.status));
    res.json(response.message);
}

module.exports = {
    createResponse,
    setResponse,
    setResponseCode,
    setErrorResponse,
    sendResponse
}