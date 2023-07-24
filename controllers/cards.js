/* eslint-disable */
const Card = require("../models/card");

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      const ERROR_CODE = 400;
      res.status(ERROR_CODE).send({ message: "Ошибка, проверьте запрос" });
    });
}

function createCard(req, res) {
  Card.create({ ...req.body, owner: req.user._id })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      const ERROR_CODE = 400;
      res
        .status(ERROR_CODE)
        .send({
          message: "Переданы некорректные данные при создании карточки.",
        });
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  console.log(req.params.cardId);
  Card.findByIdAndRemove(cardId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === "SomeErrorName")
        return res
          .status(ERROR_CODE)
          .send({ message: "Карточка с указанным _id не найдена." });
      res.status(ERROR_CODE).send(err.message);
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      const ERROR_CODE = 400;
      res
        .status(ERROR_CODE)
        .send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      const ERROR_CODE = 400;
      res
        .status(ERROR_CODE)
        .send({ message: "Переданы некорректные данные для снятия лайка." });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
