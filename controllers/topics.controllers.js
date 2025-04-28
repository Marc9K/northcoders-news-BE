const { selectAllTopics } = require("../models/topics.models");

exports.getTopics = async (_, response) => {
  const topics = await selectAllTopics();
  response.status(200).send({ topics });
};
