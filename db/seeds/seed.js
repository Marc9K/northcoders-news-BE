const db = require("../connection");
const { bracketed } = require("../seeds/utils");

function dropTables() {
  return db.query(`DROP TABLE IF EXISTS comments, articles, users, topics;`);
}

function creareTables() {
  return db.query(`CREATE TABLE
    IF NOT EXISTS topics (
        slug VARCHAR(50) PRIMARY KEY,
        description VARCHAR(5000),
        img_url VARCHAR(1000)
    );

CREATE TABLE
    IF NOT EXISTS users (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50),
        avatar_url VARCHAR(1000)
    );

CREATE TABLE
 IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    topic VARCHAR(50) REFERENCES topics (slug) ON DELETE SET NULL,
    author VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
    body TEXT,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
 IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles (article_id) ON DELETE CASCADE,
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);
}

const seed = ({ topicData, userData, articleData, commentData }) => {
  return dropTables().then(() => {
    return creareTables().then(() => {
      db.query(`
        INSERT INTO topics(slug, description, img_url)
        VALUES ${topicData
          .map(
            (topic) =>
              `${bracketed(topic.slug, topic.description, topic.img_url)}`
          )
          .join(",")};
          INSERT INTO users(username, name, avatar_url)
        VALUES ${userData
          .map(
            (user) => `${bracketed(user.username, user.name, user.avatar_url)}`
          )
          .join(",")};
          INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url)
        VALUES ${articleData
          .map(
            (article) =>
              `${bracketed(
                article.title,
                article.topic,
                article.author,
                article.body,
                { created_at: article.created_at },
                article.votes,
                article.article_img_url
              )}`
          )
          .join(",")};
          INSERT INTO comments(article_id, body, votes, author, created_at)
        VALUES ${commentData
          .map(
            (comment) =>
              `${bracketed(
                articleData.findIndex(
                  (article) => article.title === comment.article_title
                ) + 1,
                comment.body,
                comment.votes,
                comment.author,
                { created_at: comment.created_at }
              )}`
          )
          .join(",")};
          `);
    });
  });
};
module.exports = seed;
