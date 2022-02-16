const {
  selectTopics,
  selectArticle,
  updateArticleById,
  selectUsers,
  checkArticleExists,
  selectArticles,
  selectCommentsByArticleId,
} = require("../models/news.models");

const { customPatchErrorMsgs } = require("../db/helpers/utils");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  selectArticle(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const [msg, status] = customPatchErrorMsgs(req.body);
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
