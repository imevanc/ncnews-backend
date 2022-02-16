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

exports.selectArticles = () => {
  return db
    .query(`SELECT * FROM articles ORDER BY created_at DESC;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      return error;
    });
};
exports.selectArticle = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.body) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not found" });
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id=$1", [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
