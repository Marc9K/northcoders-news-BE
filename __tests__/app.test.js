const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../controllers/app.controllers");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeAll(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  it("200: Responds with an array of type topics", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
    expect(topics).toHaveLength(3);
    topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
  it("Responds with the correct test data", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics");
    const expected = require("../db/data/test-data/topics");
    expected.forEach((topic) => {
      delete topic.img_url;
    });
    expect(topics).toEqual(expected);
  });
});
