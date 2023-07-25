/* eslint-disable */
const User = require("../models/user");
const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;
function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(200);
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
      if (err.name === "SomeErrorName")
        return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ "message": "Ошибка запроса" });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
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
      if (err.name === "TypeError")
        return res.status(ERROR_CODE_NOT_FOUND).send({ "message": "Такой ID не существует" });
      if (err.name === "CastError")
        return res.status(ERROR_CODE_BAD_REQUEST).send({ "message": "Не верный ID" });
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
      res.status(201).send(u);
    })
    .catch((err) => {
      res.status(ERROR_CODE_BAD_REQUEST).send({
        "message": "Переданы некорректные данные при создании пользователя",
      });
    });
}

function updateUserProfile(req, res) {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  })
    .then((user) => {
      if(req.body.name.length<2 || req.body.name.length>30 || req.body.about.length<2 || req.body.about.length>30 ){return Promise.reject(res.status)}
      console.log(req.body.name.length);
      const u = {
        name: req.body.name,
        about: req.body.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(200).send(u);
    })
    .catch((err) => {
      // console.log(err);
      // console.log(err.name);
      // console.log(err.code);
      // console.log(err.kind);
      // console.log(req.body.name.length);
      res.status(ERROR_CODE_BAD_REQUEST).send({
        "message": "Переданы некорректные данные при обновлении пользователя",
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
      res.status(ERROR_CODE_BAD_REQUEST).send({
        "message": "Переданы некорректные данные при обновлении аватара.",
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
