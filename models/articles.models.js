const db = require("../db/connection.js");
exports.selectArticle = async (article_id) => {
  const articlesWithIdQuery = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  return articlesWithIdQuery.rows[0];
};
