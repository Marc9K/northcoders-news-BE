const db = require("../db/connection.js");
exports.selectArticle = async (article_id) => {
  const articlesWithIdQuery = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  return articlesWithIdQuery.rows[0];
};

exports.selectAllArticles = async () => {
  const articlesQuery = await db.query(
    `SELECT 
      articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
      CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC`
  );
  return articlesQuery.rows;
};
