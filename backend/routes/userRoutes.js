//api/user
const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser).get(verifyAuth, allUsers);
router.post("/login", authUser);

module.exports = router;