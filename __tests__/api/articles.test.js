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
      expect(articles).toHaveLength(10);
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
          const result = await request(app).get("/api/articles/").expect(200);
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
        it("Responds with sorted by created_at articles when the column does not exist", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?sort_by=aaaa").expect(400);
        });
        it("Responds with sorted by any column articles on query", async () => {
          const columns = [
            "article_id",
            "title",
            "topic",
            "author",
            "votes",
            "article_img_url",
            "created_at",
          ];

          async function expectToBeSortedBy(column) {
            const {
              body: { articles },
            } = await request(app)
              .get(`/api/articles?sort_by=${column}`)
              .expect(200);
            expect(articles).toBeSorted({ key: column, descending: true });
          }
          await Promise.all(
            columns.map((column) => expectToBeSortedBy(column))
          );
        });
      });
      describe("order", () => {
        it("Responds with sorted in descending order articles with invalid option", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?order=aaaa").expect(400);
        });
        it("Responds with sorted in descending order articles on query", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?order=desc").expect(200);
          expect(articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
        it("Responds with sorted in ascending order articles on query", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles?order=asc").expect(200);
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
      describe("pagination", () => {
        test("Responds with 10 by default", async () => {
          const {
            body: { articles },
          } = await request(app).get("/api/articles/");
          expect(articles).toHaveLength(10);
        });
        test("Responds with the set limit amount", async () => {
          const limit = 12;
          const {
            body: { articles },
          } = await request(app).get(`/api/articles?limit=${limit}`);
          expect(articles).toHaveLength(limit);
        });
        test("Responds with all the articles if limit is higher than total_count", async () => {
          const limit = 50;
          const {
            body: { articles },
          } = await request(app).get(`/api/articles?limit=${limit}`);
          expect(articles).toHaveLength(13);
        });
        test("Respons with the total_count", async () => {
          const {
            body: { total_count },
          } = await request(app).get(`/api/articles`);
          expect(total_count).not.toBeUndefined();
          expect(typeof total_count === "number").toBe(true);
          expect(!isNaN(total_count)).toBe(true);
        });
        test("Responds with the set page and default 10 limit", async () => {
          const page = 2;
          const {
            body: { articles },
          } = await request(app).get(
            `/api/articles?p=${page}&sort_by=article_id&order=asc`
          );
          expect(articles[0].article_id).toEqual(10 + 1);
        });
        test("Responds with the set page and custom limit", async () => {
          const page = 2;
          const limit = 5;
          const {
            body: { articles },
          } = await request(app).get(
            `/api/articles?p=${page}&limit=${limit}&sort_by=article_id&order=asc`
          );
          expect(articles).toHaveLength(5);
          expect(articles[0].article_id).toEqual(5 + 1);
        });
        test("400: Responds with error if page < 1", async () => {
          const page = 0;
          await request(app).get(`/api/articles?p=${page}`).expect(400);
        });
        test("400: Responds with error if limit < 1", async () => {
          const limit = -2;
          await request(app).get(`/api/articles?limit=${limit}`).expect(400);
        });
      });
    });
  });
  describe("POST", () => {
    test("200: Responds with an article", async () => {
      const articleToPost = {
        title: "Seafood substitutions are increasing",
        topic: "cats",
        author: "rogersop",
        body: "Wow",
        article_img_url: "https://l2c.northcoders.com/courses",
      };
      const {
        body: { article },
      } = await request(app)
        .post("/api/articles/")
        .send(articleToPost)
        .expect(200);
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_img_url: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });

    test("Responds with the posted article", async () => {
      const articleToPost = {
        title: "Seafood substitutions are increasing",
        topic: "cats",
        author: "rogersop",
        body: "Wow",
        article_img_url: "https://l2c.northcoders.com/courses",
      };
      const {
        body: { article },
      } = await request(app)
        .post("/api/articles/")
        .send(articleToPost)
        .expect(200);
      expect(article).toMatchObject({
        ...articleToPost,
        created_at: expect.any(String),
        votes: 0,
        comment_count: 0,
      });
    });
    test("Defaults img_url in case it's not passed", async () => {
      const articleToPost = {
        title: "Seafood substitutions are increasing",
        topic: "cats",
        author: "rogersop",
        body: "Wow",
      };
      const {
        body: { article },
      } = await request(app).post("/api/articles/").send(articleToPost);
      expect(article.article_img_url).toEqual(
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      );
    });

    test("404: Responds with not found when author with username does not exist", async () => {
      const articleToPost = {
        title: "Seafood substitutions are increasing",
        topic: "cats",
        author: "not_an_author",
        body: "Wow",
        article_img_url: "https://l2c.northcoders.com/courses",
      };
      await request(app).post("/api/articles/").send(articleToPost).expect(404);
    });
    test("404: Responds with not found when topic does not exist", async () => {
      const articleToPost = {
        title: "Seafood substitutions are increasing",
        topic: "not_a_topic",
        author: "rogersop",
        body: "Wow",
        article_img_url: "https://l2c.northcoders.com/courses",
      };
      await request(app).post("/api/articles/").send(articleToPost).expect(404);
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
      expect(article).toMatchObject({
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: expect.any(String),
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
      expect(article).toMatchObject({
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: expect.any(String),
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
  describe("DELETE", () => {
    test("204: Responds with No content on success", async () => {
      await request(app).delete("/api/articles/1").expect(204);
    });
    test("404: Responds with Not found when deleting nonexistent article_id", async () => {
      await request(app).delete("/api/articles/100").expect(404);
    });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    it("200: Responds with an array of type comments", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments");
      expect(comments).toHaveLength(10);
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
    describe("queries", () => {
      describe("pagination", () => {
        test("Responds with 10 comments by default", async () => {
          const {
            body: { comments },
          } = await request(app).get("/api/articles/1/comments");
          expect(comments).toHaveLength(10);
        });
        test("Responds with the set limit amount ", async () => {
          const {
            body: { comments },
          } = await request(app).get("/api/articles/1/comments?limit=5");
          expect(comments).toHaveLength(5);
        });
        test("Responds with all the comments if limit is higher than total_count", async () => {
          const {
            body: { comments },
          } = await request(app).get("/api/articles/1/comments?limit=500");
          expect(comments).toHaveLength(11);
        });
        test("Respons with the total_count", async () => {
          const { body } = await request(app).get(
            "/api/articles/1/comments?limit=5"
          );
          expect(body).toMatchObject({ total_count: expect.any(Number) });
        });
        test("Responds with the set page and default 10 limit", async () => {
          const page = 2;
          const {
            body: { comments },
          } = await request(app).get(`/api/articles/1/comments?p=${page}`);
          expect(comments[0].body).toEqual("Superficially charming");
        });
        test("Responds with the set page and custom limit", async () => {
          const page = 2;
          const limit = 5;
          const {
            body: { comments },
          } = await request(app).get(
            `/api/articles/1/comments?p=${page}&limit=${limit}`
          );
          expect(comments[0].body).toEqual("Delicious crackerbreads");
        });
        test("400: Responds with error if page < 1", async () => {
          await request(app).get(`/api/articles/1/comments?p=-1`).expect(400);
        });
        test("400: Responds with error if limit < 1", async () => {
          await request(app)
            .get("/api/articles/1/comments?limit=0")
            .expect(400);
        });
      });
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
