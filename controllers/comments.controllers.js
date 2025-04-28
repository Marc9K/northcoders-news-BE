const { selectComments } = require("../models/comments.models");
const { selectArticle } = require("../models/articles.models");
const comments = require("../db/data/test-data/comments");

exports.getComments = async (request, response, next) => {
  try {
    const article = await selectArticle(request.params.article_id);
    if (!article) {
      return next({ status: 404, msg: "Article not found" });
    }
    const comments = await selectComments(request.params.article_id);
    response.status(200).send({ comments });
  } catch (error) {
    if (error.code === "22P02") {
      return next({ status: 422, msg: "Not valid article_id" });
    }
    next();
  }
};
