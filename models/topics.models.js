const db = require("../db/connection");

exports.selectAllTopics = async () => {
  const result = await db.query("SELECT slug, description FROM topics;");
  return result.rows;
};

exports.selectTopic = async (topic) => {
  const result = await db.query(
    "SELECT slug, description FROM topics WHERE slug = $1;",
    [topic]
  );
  return result.rows[0];
};
