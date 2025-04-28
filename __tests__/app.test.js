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
});

describe("GET /api/articles/", () => {
  it("200: Responds with an array of type articles", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles/").expect(200);
    expect(articles).toHaveLength(13);
    articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
  });

  test("articles are sorted by date in descending order", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles/").expect(200);
    expect(articles).toBeSorted({ key: "created_at", descending: true });
  });
  test("articles do not have body properties", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles/").expect(200);
    articles.forEach((article) => {
      expect(article).not.toHaveProperty("body");
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("200: Responds with an object of type article", async () => {
      const {
        body: { article },
      } = await request(app).get("/api/articles/1").expect(200);
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });
    it("Responds with the correct object from test database", async () => {
      const {
        body: { article },
      } = await request(app).get("/api/articles/2");
      expect(article).toEqual({
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });
    it("404: Responds with Not found for non existant article", async () => {
      return await request(app).get("/api/articles/50").expect(404);
    });
    it("422: Responds with Unprocessable Entity for non invalid article_id", async () => {
      return await request(app).get("/api/articles/aaa").expect(422);
    });
  });
});
