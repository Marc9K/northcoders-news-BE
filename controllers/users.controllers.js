const { selectAllUsers, selectUser } = require("../models/users.models");

exports.getAllUsers = async (request, response, next) => {
  const users = await selectAllUsers();
  response.status(200).send({ users });
};

exports.getUser = async (request, response, next) => {
  const { username } = request.params;
  try {
    const user = await selectUser(username);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
