const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());

const apiRouter = require("./routers/api");
app.use(express.json());

app.use("/api", apiRouter);

// Logic error
app.use((error, req, response, next) => {
  if ([404, 422].includes(error.status)) {
    return response.status(error.status).send({ msg: error.msg });
  }
  return next(error);
});

// SQL error
app.use((error, req, response, next) => {
  switch (error.code) {
    case "23503":
      return response.status(404).send({ msg: error.detail });
    case "23502":
      return response.status(400).send({ msg: error.detail });
    case "23505":
      return response.status(409).send({ msg: error.detail });
    case "22P02":
      return response.status(400).send({ msg: "Bad request" });
    case "2201X":
      return response.status(400).send({ msg: error.message });
    case "2201W":
      return response.status(400).send({ msg: error.message });
    default:
      next(error);
  }
});

app.use((err, req, response) => {
  return response.status(500).send({ msg: "Oops, try again" });
});

module.exports = app;
