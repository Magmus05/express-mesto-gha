const router = require("express").Router();
const auth = require("../middlewares/auth");
const regexLink = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", auth, getCards);
router.post(
  "/", auth,
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().regex(new RegExp(regexLink)),
      })
  }),
  createCard
);

router.delete(
  "/:cardId", auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard
);
router.put(
  "/:cardId/likes", auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),

  likeCard
);
router.delete(
  "/:cardId/likes", auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard
);

module.exports = router;
