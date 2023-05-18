require("dotenv").config();
require("./api/data/dbconnection");

const express = require("express");
const app = express();
const router = require("./api/routes");

const server = app.listen(process.env.PORT, function() {
    console.log("Server is running on port: ", server.address().port);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use("/api", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, DELETE, POST");
    res.header("Access-Control-Allow-Headers", "Origin, XRequested-With, Content-Type, Accept");
    next();
});

app.use("/api", router);
