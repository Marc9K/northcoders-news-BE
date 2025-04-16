const db = require("./db/connection");

async function queryUsers() {
  const response = await db.query("SELECT * FROM users");
  db.end();
  console.log(response.rows);
}

async function queryCoding() {
  const response = await db.query(
    "SELECT * FROM articles WHERE topic='coding'"
  );
  db.end();
  console.log(response.rows);
}

async function queryDownvotedComments() {
  const response = await db.query("SELECT * FROM comments WHERE votes<0");
  db.end();
  console.log(response.rows);
}
async function queryUPvotedComments() {
  const response = await db.query("SELECT * FROM comments WHERE votes>10");
  db.end();
  console.log(response.rows);
}
async function queryTopics() {
  const response = await db.query("SELECT * FROM topics");
  db.end();
  console.log(response.rows);
}

async function queryForgrumpy19() {
  const response = await db.query(
    "SELECT * FROM articles WHERE author = 'grumpy19'"
  );
  db.end();
  console.log(response.rows);
}

queryUPvotedComments();
