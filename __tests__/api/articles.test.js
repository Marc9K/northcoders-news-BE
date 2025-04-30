const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data");

const request = require("supertest");
const app = require("../../controllers/app.controllers");
const comments = require("../../db/data/test-data/comments");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  db.end();
});

describe("/api/articles/", () => {
  describe("GET", () => {
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
    describe("queries", () => {
      describe("sort_by", () => {
        it("Responds with sorted by created_at in descending order articles by default", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles/");
          const result = await request(app).get("/api/articles/");
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
        it("Responds with sorted by created_at articles when the column does not exist", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?sort_by=aaaa");
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
        it("Responds with sorted by any column articles on query", async () => {
          await Promise.all(
            [
              "article_id",
              "title",
              "topic",
              "author",
              "votes",
              "article_img_url",
              "created_at",
            ].map((column) => {
              const promise = async () => {
                const {
                  body: { articles },
                } = await request(app).get(`/api/articles?sort_by=${column}`);
                expect(articles).toBeSorted({ key: column, descending: true });
              };
              return promise();
            })
          );
        });
      });
      describe("order", () => {
        it("Responds with sorted in descending order articles with invalid option", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?order=aaaa");
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
        it("Responds with sorted in descending order articles on query", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?order=desc");
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
        it("Responds with sorted in ascending order articles on query", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?order=asc");
          expect(articles).toBeSorted({
            key: "created_at",
            descending: false,
          });
        });
      });
      describe("topic", () => {
        test("Responds with articles of specified topic if exists ", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?topic=cats");
          expect(articles).toHaveLength(1);
          expect(articles[0].topic).toBe("cats");
        });
        test("Responds with empty array if no artclis exist for the topic", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?topic=paper");
          expect(articles).toHaveLength(0);
        });
        test("404: Responds with Not found if topic does not exist", async () => {
          await request(app).get("/api/articles?topic=aaa").expect(404);
        });
      });
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe("GET ", () => {
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
        comment_count: expect.any(Number),
      });
    });
    it("Responds with the correct object from test database", async () => {
      const {
        body: { article },
      } = await request(app).get("/api/articles/6");
      expect(article).toEqual({
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: "2020-10-18T01:00:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 1,
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
        comment_count: 0,
      });
    });
    it("404: Responds with Not found for non existant article", async () => {
      return await request(app).get("/api/articles/50").expect(404);
    });
    it("400: Responds with Unprocessable Entity for non invalid article_id", async () => {
      await request(app).get("/api/articles/aaa").expect(400);
    });
  });
  describe("PATCH", () => {
    test("200: Responds with updated article", async () => {
      const {
        body: { article },
      } = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200);

      expect(article).toMatchObject({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 90,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      });
    });

    test("404: Responds with Not found if there is no article with article_id", async () => {
      await request(app)
        .patch("/api/articles/50")
        .send({ inc_votes: -10 })
        .expect(404);
    });
    it("400: Responds with Unprocessable Entity for non invalid article_id", async () => {
      await request(app)
        .patch("/api/articles/aaa")
        .send({ inc_votes: -10 })
        .expect(400);
    });

    test("works for negative numbers", async () => {
      const {
        body: {
          article: { votes },
        },
      } = await request(app).patch("/api/articles/1").send({ inc_votes: -10 });
      expect(votes).toBe(90);
    });
    test("works for positive numbers", async () => {
      const {
        body: {
          article: { votes },
        },
      } = await request(app).patch("/api/articles/1").send({ inc_votes: 10 });
      expect(votes).toBe(110);
    });
    test("no change for zero", async () => {
      const {
        body: {
          article: { votes },
        },
      } = await request(app).patch("/api/articles/1").send({ inc_votes: 0 });
      expect(votes).toBe(100);
    });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    it("200: Responds with an array of type comments", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments");
      expect(comments).toHaveLength(11);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
    });

    it("Sorts comments in descending order by date", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments");
      expect(comments).toBeSorted({ key: "created_at", descending: true });
    });

    it("404: Responds with Not found if there is no article with article_id", async () => {
      await request(app).get("/api/articles/50/comments").expect(404);
    });
    it("Responds with [] if there are no comments", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/12/comments");
      expect(comments).toHaveLength(0);
    });
    it("400: Responds with Unprocessable Entity for invalid article_id", async () => {
      return await request(app).get("/api/articles/aaa/comments").expect(400);
    });
  });
  describe("POST", () => {
    it("201: Responds with the posted comment", async () => {
      const commentToPost = {
        username: "butter_bridge",
        body: "Comment body",
      };
      const {
        body: { comment },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(commentToPost)
        .expect(201);
      expect(comment).toMatchObject({
        author: commentToPost.username,
        body: commentToPost.body,
        created_at: expect.any(String),
        votes: 0,
        article_id: expect.any(Number),
        comment_id: 19,
      });
    });
    it("Inserts posted comment into the database", async () => {
      const commentToPost = {
        username: "butter_bridge",
        body: "Comment body",
      };
      await request(app).post("/api/articles/1/comments").send(commentToPost);
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments");
      expect(
        comments.some(
          (comment) =>
            comment.body === commentToPost.body &&
            comment.author == commentToPost.username
        )
      ).toBe(true);
    });
    it("404: Responds with Not found if there is no article with article_id", async () => {
      const commentToPost = {
        username: "butter_bridge",
        body: "Comment body",
      };
      await request(app)
        .post("/api/articles/50/comments")
        .send(commentToPost)
        .expect(404);
    });
    it("404: Responds with Not found if there is no user with username", async () => {
      const commentToPost = { username: "User", body: "Comment body" };
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send(commentToPost)
        .expect(404);
      expect(msg).toBe('Key (author)=(User) is not present in table "users".');
    });
    describe("422: Responds with Unprocessable Entity for invalid comment", () => {
      it("has no body", async () => {
        const commentToPost = { username: "butter_bridge" };
        await request(app)
          .post("/api/articles/1/comments")
          .send(commentToPost)
          .expect(422);
      });
      it("has no username", async () => {
        const commentToPost = { body: "Comment body" };
        await request(app)
          .post("/api/articles/1/comments")
          .send(commentToPost)
          .expect(422);
      });
      it("is an empty object", async () => {
        await request(app)
          .post("/api/articles/1/comments")
          .send({})
          .expect(422);
      });
    });
  });
});
