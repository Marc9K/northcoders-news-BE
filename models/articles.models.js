const db = require("../db/connection.js");
exports.selectArticle = async (article_id) => {
  const articlesWithIdQuery = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  return articlesWithIdQuery.rows[0];
};

exports.selectAllArticles = async (sortByColumn, order) => {
  let sqlOrder = "DESC";
  if (order && order.toLowerCase() === "asc") {
    sqlOrder = "ASC";
  }
  let sqlSortByColumn = "created_at";
  if (
    [
      "article_id",
      "title",
      "topic",
      "author",
      "votes",
      "article_img_url",
    ].includes(sortByColumn)
  ) {
    sqlSortByColumn = sortByColumn;
  }
  const articlesQuery = await db.query(
    `SELECT 
      articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
      CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY ${sqlSortByColumn} ${sqlOrder}`
  );
  return articlesQuery.rows;
};

exports.updateArticle = async (article_id, inc_votes) => {
  const articleQuery = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [inc_votes, article_id]
  );
  return articleQuery.rows[0];
};
