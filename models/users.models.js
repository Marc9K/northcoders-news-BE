const db = require("../db/connection.js");

exports.selectAllUsers = async () => {
  const usersQuery = await db.query(`SELECT * FROM users`);
  return usersQuery.rows;
};
