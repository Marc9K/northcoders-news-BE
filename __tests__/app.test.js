const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../controllers/app.controllers");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("404: For non existent api enpoints", () => {
  test("/api/anything", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/anything").expect(404);
    expect(msg).toEqual("This endpoint does not exist");
  });
  test("/anything", async () => {
    const {
      body: { msg },
    } = await request(app).get("/anything").expect(500);
  });
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
});
