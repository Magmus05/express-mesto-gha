/* eslint-disable */
const router = require("express").Router();
const {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:id", getUserByID);
router.post("/", createUser);
router.patch("/me", updateUserProfile);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
