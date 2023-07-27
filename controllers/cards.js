/* eslint-disable */
const Card = require("../models/card");
const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;
const SUCCESS = 200;
const CREATE = 201;

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.status(SUCCESS).send(cards))
    .catch((err) => {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function createCard(req, res) {
  Card.create({ ...req.body, owner: req.user._id })
    .then((user) => res.status(CREATE).send(user))
    .catch((err) => {
      if (err.name === "ValidationError")
      return res.status(ERROR_CODE_BAD_REQUEST).send({
        message: `${err.message}`,
      });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((user) => {
      if (!user)
        return res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: "id не найден." });
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError")
        return res
          .status(ERROR_CODE_BAD_REQUEST)
          .send({ message: "Некорректный id." });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((user) => {
      if (!user)
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: "id карточки не найден.",
        });
      res.status(CREATE).send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId")
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "id карточки некорректный.",
        });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((user) => {
      if (!user)
        return res.status(ERROR_CODE_NOT_FOUND).send({
          message: "id карточки не найден.",
        });
      console.log(res.status);
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId")
        return res.status(ERROR_CODE_BAD_REQUEST).send({
          message: "id карточки некорректный.",
        });
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
