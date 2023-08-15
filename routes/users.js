/* eslint-disable */
const router = require("express").Router();
const auth = require("../middlewares/auth");
const regexLink =
  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  currentUser,
} = require("../controllers/users");

router.post(
  "/signup",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().regex(new RegExp(regexLink)),
      })
      .unknown(true),
  }),
  createUser
);
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

router.get("/users/", auth, getUsers);
router.get(
  "/users/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  auth,
  getUserByID
);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
      })
      .unknown(true),
  }),
  auth,
  updateUserProfile
);
router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().required().regex(new RegExp(regexLink)),
      })
      .unknown(true),
  }),
  auth,
  updateUserAvatar
);
router.get("/user/me", auth, currentUser);

module.exports = router;
