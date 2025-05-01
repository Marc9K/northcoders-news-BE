const apiRouter = require("express").Router();

const apiSpecification = require("../../endpoints.json");
const { getTopics } = require("../topics.controllers");
const { deleteComment } = require("../comments.controllers");

const { getAllUsers } = require("../users.controllers");

const articlesRouter = require("../routers/articles");

apiRouter.get("/", (_, response) => {
  response.status(200).send({ endpoints: apiSpecification });
});

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);

apiRouter.delete("/comments/:comment_id", deleteComment);

apiRouter.get("/users", getAllUsers);

apiRouter.get("/*splat", (req, response) => {
  response.status(404).send({ msg: "This endpoint does not exist" });
});

module.exports = apiRouter;
