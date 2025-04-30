const {
  selectArticle,
  selectAllArticles,
  updateArticle,
} = require("../models/articles.models");

exports.getArticle = async (request, response, next) => {
  const { article_id } = request.params;

  try {
    const article = await selectArticle(article_id);

    if (!article) {
      return next({ status: 404, msg: "Article not found" });
    }

    return response.status(200).send({ article });
  } catch ({ code }) {
    switch (code) {
      case "22P02":
        next({ status: 422, msg: "Not valid article_id" });
        break;
      default:
        next();
    }
  }
};

exports.getArticles = async (request, response, next) => {
  try {
    const articles = await selectAllArticles(
      request.query.sort_by,
      request.query.order
    );
    return response.status(200).send({
      articles,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.patchArticle = async (request, response, next) => {
  try {
    const article = await updateArticle(
      request.params.article_id,
      request.body.inc_votes
    );
    if (!article) {
      return next({ status: 404, msg: "Article not found" });
    }
    response.status(200).send({ article });
  } catch ({ code }) {
    switch (code) {
      case "22P02":
        next({ status: 422, msg: "Not valid article_id" });
        break;

      default:
        next();
        break;
    }
  }
};
