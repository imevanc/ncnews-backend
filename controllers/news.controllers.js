const {
  selectTopics,
  selectArticle,
  updateArticleById,
} = require("../models/news.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  selectArticle(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

exports.patchArticleById = (req, res) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (Object.keys(req.body).length === 0) return res.sendStatus(400);
  updateArticleById(article_id, inc_votes).then((article) => {
    res.status(200).send({ article });
  });
};
