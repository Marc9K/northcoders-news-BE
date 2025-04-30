const express = require("express");
const app = express();
const apiSpecification = require("../endpoints.json");
const { getTopics } = require("./topics.controllers");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./articles.controllers");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./comments.controllers");

const { getAllUsers } = require("./users.controllers");

app.use(express.json());

app.get("/api", (_, response) => {
  response.status(200).send({ endpoints: apiSpecification });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getAllUsers);

app.get("/api/*splat", (req, response) => {
  response.status(404).send({ msg: "This endpoint does not exist" });
});

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
    case "22P02":
      return response.status(400).send({ msg: "Bad request" });
    default:
      next(error);
  }
});

app.use((err, req, response) => {
  return response.status(500).send({ msg: "Oops, try again" });
});

module.exports = app;
