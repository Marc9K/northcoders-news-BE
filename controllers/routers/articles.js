const articlesRouter = require("express").Router();

const {
  getArticle,
  getArticles,
  patchArticle,
} = require("../articles.controllers");
const { getComments, postComment } = require("../comments.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
