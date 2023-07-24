/* eslint-disable */
const User = require("../models/user");

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(200);
      users.forEach((user) => {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      });
    })
    .catch((err) => {
      const ERROR_CODE = 500;
      if (err.name === "SomeErrorName")
        return res.status(ERROR_CODE).send({ message: "Ошибка запроса" });
      res.status(ERROR_CODE).send(err.message);
    });
}

function getUser(req, res) {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      const u = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(200).send(u);
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === "SomeErrorName")
        return res
          .status(ERROR_CODE)
          .send({ message: "Запрашиваемый пользователь не найден" });
      res.status(ERROR_CODE).send(err.message);
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
      res.status(201).send(u);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      res
        .status(ERROR_CODE)
        .send({
          message: "Переданы некорректные данные при создании пользователя",
        });
    });
}

function updateUserProfile(req, res) {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  })
    .then((user) => {
      const u = {
        name: req.body.name,
        about: req.body.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(200).send(u);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      res
        .status(ERROR_CODE)
        .send({
          message: "Переданы некорректные данные при обновлении пользователя",
        });
    });
}
function updateUserAvatar(req, res) {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then((user) => {
      const u = {
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        _id: user._id,
      };
      res.status(200).send(u);
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      res
        .status(ERROR_CODE)
        .send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
