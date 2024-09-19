const express = require('express');
const cors = require('cors');
const {
  Tests,
} = require("./src/api");
const HandleErrors = require("./src/utils/error-handler");

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // Error handling middleware
  app.use(function (err, req, res, next) {
    // Handle the error
    console.error("express-app-error:::", err);
    res.status(500).send("Internal Server Error");
  });

  //api
  Tests(app);
  // error handling
  app.use(HandleErrors);
};
