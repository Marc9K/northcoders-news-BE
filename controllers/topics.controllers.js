const { selectAllTopics } = require("../models/topics.model");

exports.getTopics = async (_, response) => {
  const topics = await selectAllTopics();
  response.status(200).send({ topics });
};
