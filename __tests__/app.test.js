const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const { convertDateToTimestamp } = require("../db/helpers/utils");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("All Endpoints", () => {
  test(`Tests the functionality of the convertDateToTimestamp 
    function from the helpers`, () => {
    const originalData = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: "2020-11-03T09:12:00.000Z",
      votes: 0,
    };
    const newData = convertDateToTimestamp(originalData);
    expect(newData).toEqual({
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: 1604394720000,
      votes: 0,
    });
  });
  test("Return a 404, when given an invalid path", () => {
    return request(app)
      .get("/an-invalid-endpoint-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route not found");
      });
  });
  describe("/api/topics", () => {
    describe("GET", () => {
      test(`This endpoint should respond with an array of topic objects, 
      each of which should have the following properties: slug and description`, () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            expect(response.body.topics).toHaveLength(3);
            response.body.topics.forEach((aTopic) => {
              expect(aTopic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      test(`This endpoint should respond with an articles 
      array of article objects, each of which should have 
      the following properties:
      author which is the username from the users table
      comment_count
      title
      article_id
      topic
      created_at
      votes
      the articles should be sorted by date in descending order.`, () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((anArticle) => {
              expect(anArticle).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test(`Test that the articles are sorted in desc order`, () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(
              convertDateToTimestamp(response.body.articles[0]).created_at
            ).toBeGreaterThanOrEqual(
              convertDateToTimestamp(
                response.body.articles[response.body.articles.length - 1]
              ).created_at
            );
          });
      });
      test(`Test the value of comment_count for a specific
      article in the array`, () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc&topic=mitch")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(11);
          });
      });
      test(`Test the value of just one query - sort by`, () => {
        return request(app)
          .get("/api/articles/?sort_by=votes&topic=cats")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("votes", {
              descending: true,
            });
            expect(articles.length).toBeGreaterThan(0);
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });
      test(`Valid topic query`, () => {
        return request(app)
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(11);
          });
      });
      test(`Existed queries with invalid values`, () => {
        return request(app)
          .get("/api/articles/?sort_by=n")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("POST", () => {
      test(`Request body accepts:
      an object with the following properties:
      username
      body
      Responds with:
      the posted comment`, () => {
        const dummyData = {
          username: "butter_bridge",
          body: "ll",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(dummyData)
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).toEqual(
              expect.objectContaining({
                article_id: 1,
                body: "ll",
                comment_id: expect.any(Number),
                author: "butter_bridge",
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("should get a 400 response when passed an empty object", () => {
        const dummyData = {};
        return request(app)
          .post("/api/articles/1/comments")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("misspelt key on the post object", () => {
        const dummyData = { mispelled_username: "butter_bridge", body: "Body" };
        return request(app)
          .post("/api/articles/1/comments")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test(`Incorrect data (ie type of value 
        from the k,v pair) passed`, () => {
        const dummyData = { username: 1, body: "Body" };
        return request(app)
          .post("/api/articles/1/comments")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test(`Username does not exist.`, () => {
        const dummyData = { username: "Jacob", body: "Body" };
        return request(app)
          .post("/api/articles/1/comments")
          .send(dummyData)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Username Not Found");
          });
      });
      test("extra keys on the post object", () => {
        const dummyData = { username: "butter_bridge", body: "Body", votes: 1 };
        return request(app)
          .post("/api/articles/1/comments")
          .send(dummyData)
          .expect(403)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Forbidden");
          });
      });

      test("invalid article id", () => {
        const dummyData = { username: "butter_bridge", body: "Body" };
        return request(app)
          .post("/api/articles/an-invalid-id/comments")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("valid but non-existed id", () => {
        const dummyData = { username: "butter_bridge", body: "Body" };
        return request(app)
          .post("/api/articles/12121212/comments")
          .send(dummyData)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article Not found");
          });
      });
    });
    describe("GET", () => {
      test(`This endpoint should respond an array of comments
      for the given article_id of which each comment should 
      have the following properties:
      comment_id
      votes
      created_at
      author which is the username from the users table
      body`, () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            body.comments.forEach((comment) => {
              expect(convertDateToTimestamp(comment)).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(Number),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test("invalid article id", () => {
        return request(app)
          .get("/api/articles/an-invalid-id/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("valid but non-existed id", () => {
        return request(app)
          .get("/api/articles/12121212/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article Not found");
          });
      });
      test("valid id no comments", () => {
        return request(app)
          .get("/api/articles/10/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toHaveLength(0);
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test(`This endpoint should respond an article object, 
      which should have the following properties:
      author which is the username from the users table
      title
      article_id
      body
      topic
      created_at
      votes`, () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(convertDateToTimestamp(body.article)).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(Number),
                votes: expect.any(Number),
                comment_count: "11",
              })
            );
          });
      });
      test("invalid article id", () => {
        return request(app)
          .get("/api/articles/an-invalid-id")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("valid but non-existed id", () => {
        return request(app)
          .get("/api/articles/12121212")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article Not found");
          });
      });
    });
    describe("PATCH", () => {
      test(`Request body accepts:
      an object in the form { inc_votes: newVote }
      newVote will indicate how much the votes property
      in the database should be updated by.
      Responds with:
      the updated article`, () => {
        const dummyData = { inc_votes: 1 };
        return request(app)
          .patch("/api/articles/1")
          .send(dummyData)
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: 101,
              })
            );
          });
      });
      test(`Request body accepts:
      an object in the form { inc_votes: newVote }
      newVote will indicate how much the votes property
      in the database should be updated by.
      Responds with:
      the updated article`, () => {
        const dummyData = { inc_votes: -10 };
        return request(app)
          .patch("/api/articles/1")
          .send(dummyData)
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: 90,
              })
            );
          });
      });
      test("should get a 400 response when passed an empty object", () => {
        const dummyData = {};
        return request(app)
          .patch("/api/articles/1")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("misspelt key on the patch object", () => {
        const dummyData = { mispelled_inc_votes: -10 };
        return request(app)
          .patch("/api/articles/1")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test(`Incorrect data passed`, () => {
        const dummyData = { inc_votes: "-10" };
        return request(app)
          .patch("/api/articles/1")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("extra keys on the patch object", () => {
        const dummyData = { inc_votes: -10, author: "Peter" };
        return request(app)
          .patch("/api/articles/1")
          .send(dummyData)
          .expect(403)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Forbidden");
          });
      });
      test("invalid article id", () => {
        const dummyData = { inc_votes: -10 };
        return request(app)
          .patch("/api/articles/an-invalid-id")
          .send(dummyData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("valid but non-existed id", () => {
        const dummyData = { inc_votes: -10 };
        return request(app)
          .patch("/api/articles/12121212")
          .send(dummyData)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Article Not found");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      test(`This endpoint should respond with an array of objects, 
        each object should have the following property - "username"`, () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((response) => {
            expect(response.body.users).toHaveLength(4);
            response.body.users.forEach((aUser) => {
              expect(aUser).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      test(`Should:
      delete the given comment by comment_id
      Responds with:
      status 204 and no content`, () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("invalid comment id", () => {
        return request(app)
          .delete("/api/comments/an-invalid-id")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("valid but non-existed id", () => {
        return request(app)
          .delete("/api/comments/12121212")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comment Not Found");
          });
      });
    });
  });
  describe("/api", () => {
    describe("GET", () => {
      test("should return the endpoint.json file", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints);
          });
      });
    });
  });
});
