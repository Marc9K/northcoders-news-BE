const db = require("../db/connection");
exports.selectComments = async (article_id) => {
  const commentsQuery = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
    [article_id]
  );
  return commentsQuery.rows;
};

exports.insertComment = async (article_id, username, body) => {
  const commentQuery = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
    [article_id, username, body]
  );
  return commentQuery.rows[0];
};
