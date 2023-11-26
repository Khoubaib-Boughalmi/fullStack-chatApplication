//api/user
const express = require("express");
const { registerUser, loginUser, findUsers } = require("../controllers/userControllers");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser).get(verifyAuth, findUsers);
router.post("/login", loginUser);

module.exports = router;