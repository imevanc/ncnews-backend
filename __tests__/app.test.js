const req = require("express/lib/request");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const { convertDateToTimestamp } = require("../db/helpers/utils");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("All Endpoints", () => {
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
              })
            );
          });
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
              votes: expect.any(Number),
            })
          );
        });
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
            votes: expect.any(Number),
          })
        );
      });
  });
  test("should get a 400 response when passed an empty object", () => {
    const dummyData = {};
    return request(app).patch("/api/articles/1").send(dummyData).expect(400);
  });
  test("invalid article id", () => {
    const dummyData = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/an-invalid-id")
      .send(dummyData)
      .expect(400);
  });
  test("valid but non-existed id", () => {
    const dummyData = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/12121212")
      .send(dummyData)
      .expect(404);
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
