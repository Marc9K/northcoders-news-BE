const apiRouter = require("express").Router();

const apiSpecification = require("../../endpoints.json");

const { getAllUsers, getUser } = require("../users.controllers");

const articlesRouter = require("../routers/articles");
const commentsRouter = require("../routers/comments");
const topicsRouter = require("../routers/topics");

apiRouter.get("/", (_, response) => {
  response.status(200).send({ endpoints: apiSpecification });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/users", getAllUsers);
apiRouter.get("/users/:username", getUser);

apiRouter.get("/*splat", (req, response) => {
  response.status(404).send({ msg: "This endpoint does not exist" });
});

module.exports = apiRouter;
