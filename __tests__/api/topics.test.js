const request = require("supertest");
const app = require("../../controllers/app.controllers");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
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
  describe("POST", () => {
    test("201: Responds with a topic", async () => {
      const topicToPost = {
        slug: "Test",
        description: "Test",
      };
      const {
        body: { topic },
      } = await request(app).post("/api/topics").send(topicToPost).expect(201);
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
    test("Responds with the topic posted", async () => {
      const topicToPost = {
        slug: "Test",
        description: "Test",
      };
      const {
        body: { topic },
      } = await request(app).post("/api/topics").send(topicToPost);
      expect(topic).toMatchObject(topicToPost);
    });
    test("Posts the topic", async () => {
      const topicToPost = {
        slug: "Test",
        description: "Test",
      };
      await request(app).post("/api/topics").send(topicToPost);
      const {
        body: { topics },
      } = await request(app).get("/api/topics");
      expect(topics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            slug: "Test",
            description: "Test",
          }),
        ])
      );
    });

    test("400: Responds with error if request object is invalid due to no slug", async () => {
      await request(app)
        .post("/api/topics")
        .send({
          description: "Test",
        })
        .expect(400);
    });

    test("409: Responds with Conflict when posting topic with existing slug", async () => {
      await request(app)
        .post("/api/topics")
        .send({
          slug: "mitch",
          description: "Test",
        })
        .expect(409);
    });
  });
});
