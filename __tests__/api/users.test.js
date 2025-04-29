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

describe("/api/users/", () => {
  describe("GET", () => {
    it("200: Responds with an array of type user", async () => {
      const {
        body: { users },
      } = await request(app).get("/api/users").expect(200);
      expect(users.length > 0).toBe(true);
      users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
    });
  });
});
