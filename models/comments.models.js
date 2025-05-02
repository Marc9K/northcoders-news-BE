const db = require("../db/connection");
exports.selectComments = async (article_id, limit = 10, page = 1) => {
  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  const offset = limit * (page - 1);

  const commentsQuery = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
    [article_id, offset, limit]
  );
  return commentsQuery.rows;
};

exports.countComments = async (article_id) => {
  const commentsCountQuery = await db.query(
    `SELECT CAST(COUNT(*) AS INTEGER) AS total_count FROM comments WHERE article_id = $1`,
    [article_id]
  );
  return commentsCountQuery.rows[0].total_count;
};

exports.insertComment = async (article_id, username, body) => {
  const commentQuery = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
    [article_id, username, body]
  );
  return commentQuery.rows[0];
};

exports.deleteComment = async (comment_id) => {
  const commentQuery = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
    [comment_id]
  );
  return commentQuery.rows[0];
};

exports.patchComment = async (comment_id, votesToAdd) => {
  const commentQuery = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
    [votesToAdd, comment_id]
  );
  const patchedComment = commentQuery.rows[0];
  if (!patchedComment) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return patchedComment;
};
