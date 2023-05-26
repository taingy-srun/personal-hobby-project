require("dotenv").config();
require("./api/data/dbconnection");

const express = require("express");
const app = express();
const router = require("./api/routes");

const server = app.listen(process.env.PORT, function() {
    console.log(process.env.SERVER_RUNNING_MESSAGE, server.address().port);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use(process.env.API_ENDPOINT, function(req, res, next) {
    res.header(process.env.CORS_ALLOW_ORIGIN_KEY, process.env.CORS_ALLOW_ORIGIN_VALUE);
    res.header(process.env.CORS_ALLOW_METHOD_KEY, process.env.CORS_ALLOW_METHOD_VALUE);
    res.header(process.env.CORS_ALLOW_HEADER_KEY, process.env.CORS_ALLOW_HEADER_VALUE);
    next();
});

app.use(process.env.API_ENDPOINT, router);
