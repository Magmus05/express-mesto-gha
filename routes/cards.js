/* eslint-disable */
const router = require("express").Router();
const auth = require("../middlewares/auth");
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
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),

    }).unknown(true),
  }),
  auth,
  createCard
);
router.delete("/:cardId", auth, deleteCard);
router.put("/:cardId/likes", auth, likeCard);
router.delete("/:cardId/likes", auth, dislikeCard);

module.exports = router;
