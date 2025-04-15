const db = require("../../db/connection");

function convertTimestampToDate({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
}

exports.convertTimestampToDate = convertTimestampToDate;

function quated(value) {
  if (typeof value === "string") {
    return `'${value.replaceAll("'", "''")}'`;
  } else if (typeof value === "object") {
    let date = convertTimestampToDate(value).created_at;
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const time = `'${date.toISOString().slice(0, 19).replace("T", " ")}'`;
    return time;
  } else {
    return `${value}`;
  }
}

exports.bracketed = (...args) => {
  return `(${args.map(quated).join(", ")})`;
};
