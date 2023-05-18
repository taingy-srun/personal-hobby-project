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

const sendResponse = function(res, response) {
    res.status(parseInt(response.status));
    res.json(response.message);
}

module.exports = {
    createResponse,
    setResponse,
    sendResponse
}