const db = require("../db/connection");

exports.selectTopics = () => {
  return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      return error;
    });
};

exports.selectArtictles = () => {
  return db
    .query(`SELECT * FROM articles ORDER BY created_at DESC;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      return error;
    });
};
