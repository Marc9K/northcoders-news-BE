const {
  selectComments,
  insertComment,
  deleteComment,
} = require("../models/comments.models");
const { selectArticle } = require("../models/articles.models");

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

exports.postComment = async (request, response, next) => {
  if (!request.body || !request.body.body || !request.body.username) {
    return next({ status: 422, msg: "Missing required fields" });
  }
  const article = await selectArticle(request.params.article_id);
  if (!article) {
    return next({ status: 404, msg: "Article not found" });
  }

  try {
    const insertedComment = await insertComment(
      request.params.article_id,
      request.body.username,
      request.body.body
    );

    response.status(201).send({ comment: insertedComment });
  } catch ({ code }) {
    switch (code) {
      case "23503":
        next({ status: 404, msg: `User ${request.body.username} not found` });
        break;
      default:
        next();
        break;
    }
  }
};

exports.deleteComment = async (request, response, next) => {
  try {
    const comment = await deleteComment(request.params.comment_id);
    if (!comment) {
      return next({ status: 404, msg: "Comment not found" });
    }
    response.status(204).send();
  } catch ({ code }) {
    switch (code) {
      case "22P02":
        next({ status: 422, msg: "Not valid comment_id" });
        break;
      default:
        next();
        break;
    }
  }
};
