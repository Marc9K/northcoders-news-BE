const articlesRouter = require("express").Router();

const {
  getArticle,
  getArticles,
  patchArticle,
  postArticle,
  deleteArticle,
} = require("../articles.controllers");
const { getComments, postComment } = require("../comments.controllers");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
