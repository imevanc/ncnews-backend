const {
  selectTopics,
  selectArticle,
  updateArticleById,
  selectUsers,
  checkArticleExists,
  selectArticles,
  selectCommentsByArticleId,
  checkTopicExists,
  insertCommentByArticleId,
  checkUsernameExists,
  removeCommentById,
  checkCommentIdExists,
  selectArticlesByTopic,
} = require("../models/news.models");

const {
  customErrorMsgs,
  sortByIsValid,
  orderIsValid,
  invalidQuery,
} = require("../db/helpers/utils");

const endpoints = require("../endpoints.json");
const { sort } = require("../db/data/test-data/articles");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

getArticlesByTopic = (sort_by, order, topic, res, next) => {
  if (!sort_by && !order && topic.length) {
    res.status(200).send({ articles: [] });
  }
  if (!sortByIsValid(sort_by) || !orderIsValid(order)) {
    res.status(400).send({ msg: "Bad Request" });
  }
  Promise.all([
    checkTopicExists(topic),
    selectArticlesByTopic(sort_by, order, topic),
  ])
    .then(([, articles]) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticles = (req, res, next) => {
  let { sort_by, order, topic } = req.query;
  if (sort_by || order || topic) {
    getArticlesByTopic(sort_by, order, topic, res, next);
  }
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([checkArticleExists(article_id), selectArticle(article_id)])
    .then(([, promisedData]) => {
      article = promisedData;
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;
  const len = Object.keys(req.body).length;
  const [msg, status] = customErrorMsgs(data, len, ["inc_votes"], ["number"]);
  if (status === 403 || status === 400) {
    res.status(status).send({ msg });
  }
  const { inc_votes } = req.body;
  Promise.all([
    checkArticleExists(article_id),
    updateArticleById(article_id, inc_votes),
  ])
    .then((promisedData) => {
      article = promisedData[1];
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const data = req.body;
  const len = Object.keys(req.body).length;
  const [msg, status] = customErrorMsgs(
    data,
    len,
    ["username", "body"],
    ["string", "string"]
  );
  if (status === 403 || status === 400) {
    res.status(status).send({ msg });
  }
  const { username, body } = req.body;
  Promise.all([
    checkArticleExists(article_id),
    checkUsernameExists(username),
    insertCommentByArticleId(username, body, article_id),
  ])
    .then(([, , promisedData]) => {
      comment = promisedData;
      res.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    checkArticleExists(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then((promisedData) => {
      comments = promisedData[1];
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([checkCommentIdExists(comment_id), removeCommentById(comment_id)])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};
