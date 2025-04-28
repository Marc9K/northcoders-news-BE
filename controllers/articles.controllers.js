const {
  selectArticle,
  selectAllArticles,
} = require("../models/articles.models");

exports.getArticle = async (request, response, next) => {
  const { article_id } = request.params;

  if (isNaN(article_id) || article_id < 1) {
    return next({ status: 422, msg: "Invalid article_id" });
  }

  const article = await selectArticle(article_id);

  if (!article) {
    return next({ status: 404, msg: "Article not found" });
  }

  return response.status(200).send({ article });
};

exports.getArticles = async (request, response, next) => {
  return response.status(200).send({ articles: await selectAllArticles() });
};
