const {
  selectComments,
  insertComment,
  deleteComment,
  patchComment,
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
    next(error);
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
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (request, response, next) => {
  try {
    const comment = await deleteComment(request.params.comment_id);
    if (!comment) {
      return next({ status: 404, msg: "Comment not found" });
    }
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.patchComment = async (request, response, next) => {
  try {
    const votesToAdd = request.body.inc_votes;
    if (!votesToAdd) {
      return next({ status: 400, msg: "Missing required fields" });
    }
    const comment = await patchComment(request.params.comment_id, votesToAdd);
    response.status(200).send({ comment });
  } catch (error) {
    next(error);
  }
};
