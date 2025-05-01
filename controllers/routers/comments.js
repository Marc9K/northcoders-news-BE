const commentsRouter = require("express").Router();
const { deleteComment, patchComment } = require("../comments.controllers");

commentsRouter.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
