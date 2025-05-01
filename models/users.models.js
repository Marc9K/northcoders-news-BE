const db = require("../db/connection.js");

exports.selectAllUsers = async () => {
  const usersQuery = await db.query(`SELECT * FROM users`);
  return usersQuery.rows;
};

exports.selectUser = async (username) => {
  const userQuery = await db.query(
    `SELECT * FROM users
    WHERE username = $1`,
    [username]
  );
  if (userQuery.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
  return userQuery.rows[0];
};
