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

describe("/api/users/:username", () => {
  test("200: Responds with an existing user", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/butter_bridge").expect(200);
    expect(user).toMatchObject({
      username: expect.any(String),
      name: expect.any(String),
      avatar_url: expect.any(String),
    });
  });
  test("Responds with correct user data", async () => {
    const {
      body: { user },
    } = await request(app).get("/api/users/butter_bridge");
    expect(user).toEqual({
      username: "butter_bridge",
      name: "jonny",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    });
  });
  test("404: Responds with an error if user does not exist", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/users/not_a_user").expect(404);
    expect(msg).toBe("User not found");
  });
});
