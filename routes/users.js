/* eslint-disable */
const router = require("express").Router();
const auth = require("../middlewares/auth");

const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
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
    params: Joi.object()
      .keys({
        // id: Joi.string().required().objectId(),
      })
      .unknown(true),
  }),
  auth,
  getUserByID
);
router.patch("/users/me",  celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    })
    .unknown(true),
}), auth, updateUserProfile);
router.patch("/users/me/avatar", auth, updateUserAvatar);
//router.get("/users/me", auth, getUsers);

module.exports = router;
