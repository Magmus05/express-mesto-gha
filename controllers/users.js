/* eslint-disable */
const User = require("../models/user");
const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;
const SUCCESS = 200;
const CREATE = 201;

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(SUCCESS);
      res.send(
        users.map((user) => {
          return user;
        })
      );
    })
    .catch((err) => {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function getUserByID(req, res) {
  User.findById(req.params.id)
    .orFail(new Error("NotValidId"))
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidId")
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "Такой ID не существует" });
      if (err.name === "CastError")
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Не верный ID" });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function createUser(req, res) {
  User.create({ ...req.body })
    .then((user) => {
      res.status(CREATE).send(user);
    })
    .catch((err) => {
      console.log(err.name);
      console.log(err.message);

      if (err.name === "ValidationError")
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: `${err.message}`,
        });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function updateUserProfile(req, res) {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: `${err.message}`,
        });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function updateUserAvatar(req, res) {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!req.body.avatar) {
        return Promise.reject(res.status);
      }
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.name === "status")
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
