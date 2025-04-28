const { selectAllTopics } = require("../models/topics.model");

exports.getTopics = async (_, response) => {
  try {
    const topics = await selectAllTopics();
    response.status(200).send({ topics });
  } catch (error) {
    console.log(error);
  }
};
