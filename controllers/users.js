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
          return {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          };
        })
      );
    })
    .catch((err) => {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function getUserByID(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      const u = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(SUCCESS).send(u);
    })
    .catch((err) => {
      if (err.name === "TypeError")
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
      const u = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(CREATE).send(u);
    })
    .catch((err) => {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        message: "Переданы некорректные данные при создании пользователя",
      });
    });
}

function updateUserProfile(req, res) {
  console.log(req.body.name);
  if (req.body.name) {
    if (req.body.name.length < 2 || req.body.name.length > 30) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message:
          "Переданы некорректные данные при обновлении имени пользователя, оно должно быть длиной от 2 до 30 символов.",
      });
    }
  }
  if (req.body.about) {
    if (req.body.about.length < 2 || req.body.about.length > 30) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message:
          "Переданы некорректные данные при обновлении информации о  пользователе, оно должно быть длиной от 2 до 30 символов.",
      });
    }
  }

  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true }
  )
    .then((user) => {
      const u = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(SUCCESS).send(u);
    })
    .catch((err) => {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}
function updateUserAvatar(req, res) {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then((user) => {
      if (!req.body.avatar) {
        return Promise.reject(res.status);
      }
      console.log(req.body.avatar);
      const u = {
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        _id: user._id,
      };
      res.status(200).send(u);
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
