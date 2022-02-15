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
      title
      article_id
      topic
      created_at
      votes
      the articles should be sorted by date in descending order.`, () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(12);
            response.body.articles.forEach((anArticle) => {
              expect(anArticle).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
            expect(
              convertDateToTimestamp(response.body.articles[0]).created_at
            ).toBeGreaterThanOrEqual(
              convertDateToTimestamp(
                response.body.articles[response.body.articles.length - 1]
              ).created_at
            );
          });
      });
    });
  });
});
