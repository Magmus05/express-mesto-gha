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
router.post("/users/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), createUser);
router.post("/users/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(auth);
router.get("/users/", getUsers);
router.get("/users/:id", getUserByID);
router.patch("/users/me", updateUserProfile);
router.patch("/users/me/avatar", updateUserAvatar);
//router.get("/users/me", auth, getСurrentUser);

module.exports = router;
