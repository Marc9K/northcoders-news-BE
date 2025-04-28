const express = require("express");
const app = express();
const apiSpecification = require("../endpoints.json");

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints: apiSpecification });
});

module.exports = app;
