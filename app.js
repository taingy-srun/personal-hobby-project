require("dotenv").config();
require("./api/data/dbconnection");

const express = require("express");
const app = express();
const router = require("./api/routes/routes");

const server = app.listen(process.env.PORT, function() {
    console.log("Server is running on port: ", server.address().port);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use("/api", router);
