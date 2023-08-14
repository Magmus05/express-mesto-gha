/* eslint-disable */
const router = require("express").Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,

} = require("../controllers/users");

router.get("/users/", auth, getUsers);
router.get("/users/:id", auth, getUserByID);
router.post("/users/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);
router.post("/users/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.patch("/users/me", auth, updateUserProfile);
router.patch("/users/me/avatar", auth, updateUserAvatar);
//router.get("/users/me", auth, getСurrentUser);

module.exports = router;
