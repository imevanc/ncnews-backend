const express = require("express");
const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsers,
  getArticles,
} = require("./controllers/news.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("Server Error!");
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
