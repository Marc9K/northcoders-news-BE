const db = require("../db/connection");

exports.selectAllTopics = async () => {
  const result = await db.query("SELECT slug, description FROM topics;");
  return result.rows;
};
