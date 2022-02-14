const req = require("express/lib/request");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

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
});
