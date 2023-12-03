const express = require("express");
const router = express.Router();

const { verifyAuth } = require("../middlewares/authMiddleware");
const { sendMessage } = require("../controllers/messageControllers");

router.route("/").post(verifyAuth, sendMessage);

module.exports = router;