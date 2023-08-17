const Card = require("../models/card");
const NOT_FOUND_ERROR = require("../errors/NotFoundError");
const BAD_REQUEST_ERROR = require("../errors/BadRequestError");
const FORBIDDEN_ERROR = require("../errors/ForbiddenError");
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
      if (err.name === "ValidationError"){
      next(new BAD_REQUEST_ERROR(`${err.message}`))
    }else{next(err)}
    });
}

function deleteCard(req, res, next) {

  Card.findById(req.params.cardId).then((card) => {

    if (card === null)
    throw new NOT_FOUND_ERROR("id карточки не найден.");

    console.log(card.owner.valueOf());
    console.log(req.user._id);

    if (card.owner.valueOf() !== req.user._id)
    throw new FORBIDDEN_ERROR("У вас нет прав удалять чужие карточки");
      // return res
      //   .status(ERROR_CODE_BAD_REQUEST)
      //   .send({ message: "У вас нет прав удалять чужие карточки" });

        Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          res.status(SUCCESS).send(card);
        }).catch(next)
  }).catch(next);

}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {

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
