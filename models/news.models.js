const { query } = require("../db/connection");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");

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

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic
) => {
  const greenListSortBy = [
    "created_at",
    "title",
    "topic",
    "author",
    "votes",
    "article_id",
  ];
  const greenListOrderBy = ["asc", "desc"];

  if (!greenListSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (!greenListOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, 
  COUNT(comments.article_id) AS comments_count FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;
  const queryValues = [];
  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }
  queryStr += `GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;

  const result = await db.query(queryStr, queryValues);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Topic Not Found" });
  }
  return result.rows;
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug=$1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic Not Found" });
      }
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
      if (rows.length === 0) {
        return [];
      }
      return rows[0];
    });
};

exports.checkUsernameExists = (name) => {
  return db
    .query("SELECT * FROM users WHERE username=$1", [name])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Username Not Found" });
      }
    });
};

exports.insertCommentByArticleId = (username, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) 
      VALUES ($1, $2, $3)  RETURNING * ;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments 
      WHERE comment_id=$1;`,
      [comment_id]
    )
    .then(() => {
      return;
    });
};

exports.checkCommentIdExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id=$1", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      }
    });
};
