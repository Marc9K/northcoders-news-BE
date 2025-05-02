const topicsRouter = require("express").Router();

const { getTopics, postTopic } = require("../topics.controllers");

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;
