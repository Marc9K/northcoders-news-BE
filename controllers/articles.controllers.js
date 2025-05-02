const {
  selectArticle,
  selectAllArticles,
  updateArticle,
  insertArticle,
  countArticles,
} = require("../models/articles.models");

exports.getArticle = async (request, response, next) => {
  const { article_id } = request.params;

  try {
    const article = await selectArticle(article_id);

    if (!article) {
      return next({ status: 404, msg: "Article not found" });
    }

    return response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.getArticles = async (request, response, next) => {
  try {
    const articles = await selectAllArticles(
      request.query.sort_by,
      request.query.order,
      request.query.topic,
      request.query.limit,
      request.query.p
    );
    const total_count = await countArticles();
    return response.status(200).send({
      articles,
      total_count,
    });
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
};

exports.postArticle = async (request, response, next) => {
  try {
    const articleToPost = request.body;
    const article = await insertArticle(articleToPost);
    response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};
