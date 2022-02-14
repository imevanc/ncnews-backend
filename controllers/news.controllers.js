const { selectTopics, selectArticle } = require("../models/news.models");

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
