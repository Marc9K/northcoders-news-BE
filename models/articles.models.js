const db = require("../db/connection.js");
const { selectTopic } = require("./topics.models.js");

exports.selectArticle = async (article_id) => {
  const articlesWithIdQuery = await db.query(
    `SELECT 
    articles.author,
    articles.body,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    article_img_url,
    CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
    [article_id]
  );
  return articlesWithIdQuery.rows[0];
};

exports.countArticles = async () => {
  let sqlQuery = `SELECT CAST(COUNT(*) AS INTEGER) AS total_count FROM articles`;
  const articlesCountQuery = await db.query(sqlQuery);
  return Number(articlesCountQuery.rows[0].total_count);
};

exports.selectAllArticles = async (sortByColumn, order, topic, limit, page) => {
  let sqlOrder = "DESC";
  if (order && order.toLowerCase() === "asc") {
    sqlOrder = "ASC";
  }
  limit = limit || 10;
  page = page || 1;
  if (isNaN(page) || isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  if (
    (sortByColumn &&
      ![
        "article_id",
        "title",
        "topic",
        "author",
        "votes",
        "article_img_url",
        "created_at",
      ].includes(sortByColumn)) ||
    (order && !["DESC", "ASC"].includes(order.toUpperCase()))
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  } else if (!sortByColumn) {
    sortByColumn = "created_at";
  }
  let sqlArgs = [];
  let sqlQuery = `SELECT 
      articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
      CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      `;
  if (topic) {
    if (!(await selectTopic(topic))) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    sqlQuery += `WHERE topic = $1
        `;
    sqlArgs.push(topic);
  }
  sqlQuery += `GROUP BY articles.article_id 
      ORDER BY ${sortByColumn} ${sqlOrder}
      OFFSET ${limit * (page - 1)}
      LIMIT ${limit}
      ;`;

  const articlesQuery = await db.query(sqlQuery, sqlArgs);

  return articlesQuery.rows;
};

exports.updateArticle = async (article_id, inc_votes) => {
  const articleQuery = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [inc_votes, article_id]
  );
  return articleQuery.rows[0];
};

exports.insertArticle = async ({
  title,
  topic,
  author,
  body,
  article_img_url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
}) => {
  const articleInsertQuery = await db.query(
    `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING article_id;`,
    [title, topic, author, body, article_img_url]
  );
  const article = await exports.selectArticle(
    articleInsertQuery.rows[0].article_id
  );
  return article;
};
