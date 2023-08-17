const router = require("express").Router();
const auth = require("../middlewares/auth");
const regexLink = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;
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
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(new RegExp(regexLink)),
    }),
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
router.get("/users/me", auth, currentUser);
router.patch(
  "/users/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserProfile
);
router.patch(
  "/users/me/avatar",
  auth,
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string().required().regex(new RegExp(regexLink)),
      })
  }),
  updateUserAvatar
);

router.get(
  "/users/:id",
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserByID
);

module.exports = router;
