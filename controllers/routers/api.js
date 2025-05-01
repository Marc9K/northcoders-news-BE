const apiRouter = require("express").Router();

const apiSpecification = require("../../endpoints.json");
const { getTopics } = require("../topics.controllers");
const { deleteComment } = require("../comments.controllers");

const { getAllUsers, getUser } = require("../users.controllers");

const articlesRouter = require("../routers/articles");
const commentsRouter = require("../routers/comments");

apiRouter.get("/", (_, response) => {
  response.status(200).send({ endpoints: apiSpecification });
});

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/users", getAllUsers);
apiRouter.get("/users/:username", getUser);

apiRouter.get("/*splat", (req, response) => {
  response.status(404).send({ msg: "This endpoint does not exist" });
});

module.exports = apiRouter;
