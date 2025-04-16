const db = require("../connection");
const { convertTimestampToDate } = require("../seeds/utils");
var format = require("pg-format");

const tables = [
  {
    name: "topics",
    properties: [
      { key: "slug", type: "VARCHAR(50) PRIMARY KEY" },
      { key: "description", type: "VARCHAR(5000)" },
      { key: "img_url", type: "VARCHAR(1000)" },
    ],
  },
  {
    name: "users",
    properties: [
      { key: "username", type: "VARCHAR(50) PRIMARY KEY" },
      { key: "name", type: "VARCHAR(50)" },
      { key: "avatar_url", type: "VARCHAR(1000)" },
    ],
  },
  {
    name: "articles",
    properties: [
      { key: "article_id", type: "SERIAL PRIMARY KEY" },
      { key: "title", type: "VARCHAR(500)" },
      {
        key: "topic",
        type: "VARCHAR(50) REFERENCES topics (slug) ON DELETE SET NULL",
      },
      {
        key: "author",
        type: "VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE",
      },
      { key: "body", type: "TEXT" },
      { key: "votes", type: "INT DEFAULT 0" },
      { key: "article_img_url", type: "VARCHAR(1000)" },
      { key: "created_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },
  {
    name: "comments",
    properties: [
      { key: "comment_id", type: "SERIAL PRIMARY KEY" },
      {
        key: "article_id",
        type: "INT REFERENCES articles (article_id) ON DELETE CASCADE",
      },
      { key: "body", type: "TEXT" },
      { key: "votes", type: "INT DEFAULT 0" },
      {
        key: "author",
        type: "VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE",
      },
      { key: "created_at", type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ],
  },
];

async function dropTables() {
  return await db.query(
    `DROP TABLE IF EXISTS ${tables
      .map((table) => table.name)
      .reverse()
      .join(", ")};`
  );
}

async function creareTables() {
  for (const table of tables) {
    const properties = table.properties
      .map((property) => [property.key, property.type].join(" "))
      .join(",");
    await db.query(`CREATE TABLE IF NOT EXISTS ${table.name} (${properties});`);
  }
}

async function simpleInsert(table, properties, args) {
  return await db.query(
    format("INSERT INTO %I %s VALUES %L RETURNING *", table, properties, args)
  );
}

async function smartInsert(data, table, conversion) {
  const keys = table.properties
    .filter((property) => !property.type.includes("SERIAL"))
    .map((property) => property.key);
  return await simpleInsert(
    table.name,
    `(${keys.join(", ")})`,
    conversion
      ? data.map((dataPoint) => keys.map((key) => conversion(dataPoint)[key]))
      : data.map((dataPoint) => keys.map((key) => dataPoint[key]))
  );
}

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await dropTables();
  await creareTables();

  const topics = await smartInsert(topicData, tables[0]);
  const users = await smartInsert(userData, tables[1]);
  const articles = await smartInsert(
    articleData,
    tables[2],
    convertTimestampToDate
  );
  const comments = await smartInsert(commentData, tables[3], (comment) => {
    const timeFormattedComment = convertTimestampToDate(comment);
    timeFormattedComment.article_id = articles.rows.find(
      (article) => article.title === timeFormattedComment.article_title
    ).article_id;
    return timeFormattedComment;
  });
};
module.exports = seed;
