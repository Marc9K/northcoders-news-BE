const express = require("express");
const app = express();
const apiSpecification = require("../endpoints.json");
const { getTopics } = require("./topics.controllers");
const { getArticle, getArticles } = require("./articles.controllers");
const { getComments, postComment } = require("./comments.controllers");

app.use(express.json());

app.get("/api", (_, response) => {
  response.status(200).send({ endpoints: apiSpecification });
});

app.get("/api/topics", getTopics);
app.get("/api/articles/", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/*splat", (req, response) => {
  response.status(404).send({ msg: "This endpoint does not exist" });
});

app.use((error, req, response, next) => {
  if ([404, 422].includes(error.status)) {
    return response.status(error.status).send({ msg: error.msg });
  }
  return next();
});

app.use((err, req, response) => {
  return response.status(500).send({ msg: "Oops, try again" });
});

module.exports = app;
