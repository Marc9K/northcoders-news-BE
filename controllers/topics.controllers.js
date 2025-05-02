const { selectAllTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = async (_, response) => {
  const topics = await selectAllTopics();
  response.status(200).send({ topics });
};

exports.postTopic = async (request, response, next) => {
  try {
    const topicToPost = request.body;
    const topic = await insertTopic(topicToPost);
    response.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};
