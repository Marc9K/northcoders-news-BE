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
    it("422: Responds with Invalid input if comment_id is invalid", async () => {
      await request(app).delete("/api/comments/aaa").expect(422);
    });
  });
});
