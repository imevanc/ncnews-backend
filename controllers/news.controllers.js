const { selectTopics, selectArtictles } = require("../models/news.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res) => {
  selectArtictles().then((articles) => {
    res.status(200).send({ articles });
  });
};
