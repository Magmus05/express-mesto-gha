/* eslint-disable */
const User = require("../models/user");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
} = require("../errors/errors");
const SUCCESS = 200;
const CREATE = 201;

function getUsers(req, res, next) {
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
      throw new BAD_REQUEST_ERROR(`${err.message}`);
    })
    .catch(next);
}

function getUserByID(req, res, next) {
  console.log(req.params);
  User.findById(req.params.id)
    .orFail(new Error("NotValidId"))
    .then((user) => {
      res
        .status(SUCCESS)
        .send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidId")
        throw new NOT_FOUND_ERROR("Такой ID не существует");
      // return res
      //   .status(ERROR_CODE_NOT_FOUND)
      //   .send({ message: "Такой ID не существует" });
      if (err.name === "CastError") throw new BAD_REQUEST_ERROR("Не верный ID");
      //   return res
      //     .status(ERROR_CODE_BAD_REQUEST)
      //     .send({ message: "Не верный ID111" });
      // res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    })
    .catch(next);
}

function createUser(req, res, next) {
  console.log(req.body.email);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new CONFLICT_ERROR(`Пользователь с таким email уже существует`);
      } else {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          User.create({ ...req.body, password: hash })
            .then((user) => {
              res.status(CREATE).send({
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
                _id: user._id,
              });
            })
            .catch((err) => {
              // console.log(err.name);
              // console.log(err.message);

              if (err.name === "ValidationError")
                throw new BAD_REQUEST_ERROR(`${err.message}`);
              //   return res.status(ERROR_CODE_BAD_REQUEST).send({
              //     message: `${err.message}`,
              //   });
              // res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
            })
            .catch(next);
        });
      }
    })
    .catch(next);
}

function updateUserProfile(req, res, next) {
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
        throw new BAD_REQUEST_ERROR(`${err.message}`);
      //   return res.status(ERROR_CODE_BAD_REQUEST).send({
      //     message: `${err.message}`,
      //   });
      // res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    })
    .catch(next);
}

function updateUserAvatar(req, res, next) {
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
      if (err.name === "ValidationError")
        throw new BAD_REQUEST_ERROR(`${err.message}`);
      //   return res.status(ERROR_CODE_BAD_REQUEST).send({
      //     message: `${err.message}`,
      //   });
      // res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    })
    .catch(next);
}

async function login(req, res, next) {
  console.log(req.body);
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const SECRET_KEY = "cibirkulimay";
      console.log(user);
      const token = JWT.sign({ _id: user._id.valueOf() }, SECRET_KEY, {
        expiresIn: "7d",
      });
      // res.clearCookie("jwt")
      res.cookie("jwt", token);
      return res
        .status(SUCCESS)
        .send({ message: "Авторизация прошла успешно" });
    })
    .catch((err) => {
      throw new BAD_REQUEST_ERROR(`${err.message}`);
    })
    .catch(next);
}

function currentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail(new Error("NotValidId"))
    .then((user) => {
      res
        .status(SUCCESS)
        .send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidId")
        throw new NOT_FOUND_ERROR("Такой ID не существует");
      // return res
      //   .status(ERROR_CODE_NOT_FOUND)
      //   .send({ message: "Такой ID не существует" });
    })
    .catch(next);
}


module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  currentUser
};
