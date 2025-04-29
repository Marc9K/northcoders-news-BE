const { selectAllUsers } = require("../models/users.models");

exports.getAllUsers = async (request, response, next) => {
  const users = await selectAllUsers();
  response.status(200).send({ users });
};
