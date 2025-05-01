const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data");

const request = require("supertest");
const app = require("../../controllers/app.controllers");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});
describe("/api/comments/", () => {
  describe("DELETE", () => {
    it("204: Responds with success", async () => {
      await request(app).delete("/api/comments/2").expect(204);
    });
    it("deletes the comment", async () => {
      let { body } = await request(app).get("/api/articles/1/comments");
      expect(
        body.comments.filter((comment) => comment.comment_id === 2)
      ).toHaveLength(1);
      await request(app).delete("/api/comments/2");
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments");
      expect(
        comments.filter((comment) => comment.comment_id === 2)
      ).toHaveLength(0);
    });
    it("404: Responds with Not found if no such comment ever existed", async () => {
      await request(app).delete("/api/comments/200").expect(404);
    });
    it("400: Responds with Invalid input if comment_id is invalid", async () => {
      await request(app).delete("/api/comments/aaa").expect(400);
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("PATCH", () => {
    it("200: Responds with the updated comment", async () => {
      const { body } = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 1 })
        .expect(200);
      expect(body.comment).toEqual({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 17,
        author: "butter_bridge",
        article_id: 9,
        created_at: expect.any(String),
      });
    });
    it("Updates with negative numbers", async () => {
      const {
        body: {
          comment: { votes },
        },
      } = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -1 })
        .expect(200);
      expect(votes).toBe(15);
    });
    it("404: Responds with Not found if no such comment ever existed", async () => {
      await request(app)
        .patch("/api/comments/200")
        .send({ inc_votes: 1 })
        .expect(404);
    });
    it("400: Responds with Invalid input if comment_id is invalid", async () => {
      await request(app)
        .patch("/api/comments/aaa")
        .send({ inc_votes: 1 })
        .expect(400);
    });
    it("400: Responds with Invalid input if inc_votes is invalid", async () => {
      await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "aaa" })
        .expect(400);
    });
    it("400: Responds with Invalid input if inc_votes is missing", async () => {
      await request(app).patch("/api/comments/1").send({}).expect(400);
    });
  });
});
