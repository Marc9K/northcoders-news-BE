const db = require("./db/connection");

async function query() {
  const response = await db.query("SELECT * FROM users");
  db.end();
  console.log(response);
}

query();
