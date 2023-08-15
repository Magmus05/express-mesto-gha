/* eslint-disable */
const Card = require("../models/card");
const {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
} = require("../errors/errors");
const SUCCESS = 200;
const CREATE = 201;

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.status(SUCCESS).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  Card.create({ ...req.body, owner: req.user._id })
    .then((user) => res.status(CREATE).send(user))
    .catch((err) => {
      if (err.name === "ValidationError")
      throw new BAD_REQUEST_ERROR(`${err.message}`);
      //   return res.status(ERROR_CODE_BAD_REQUEST).send({
      //     message: `${err.message}`,
      //   });
      // res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
    }).catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId).then((card) => {
    if (card.owner !== req.body._id)
    throw new BAD_REQUEST_ERROR("У вас нет прав удалять чужие карточки");
      // return res
      //   .status(ERROR_CODE_BAD_REQUEST)
      //   .send({ message: "У вас нет прав удалять чужие карточки" });

        Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          if (!card)
          throw new NOT_FOUND_ERROR("id не найден.");
            // return res
            //   .status(ERROR_CODE_NOT_FOUND)
            //   .send({ message: "id не найден." });
          res.status(SUCCESS).send(card);
        })
        .catch((err) => {
          if (err.name === "CastError")
          throw new BAD_REQUEST_ERROR("Некорректный id.");
          //   return res
          //     .status(ERROR_CODE_BAD_REQUEST)
          //     .send({ message: "Некорректный id." });
          // res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send(err.message);
        }).catch(next);
  });

}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((user) => {

      if (card === null)
      throw new NOT_FOUND_ERROR("id карточки не найден.");
        // return res.status(ERROR_CODE_NOT_FOUND).send({
        //   message: "id карточки не найден.",
        // });
      res.status(CREATE).send(card);
    }).catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      console.log(card);
      if (card === null)
      throw new NOT_FOUND_ERROR("id карточки не найден.");
      //   return res.status(ERROR_CODE_NOT_FOUND).send({
      //     message: "id карточки не найден.",
      //   });
      // console.log(res.status);
      res.status(SUCCESS).send(card);
    }).catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
