const express = require("express");
const router = express.Router();

const { verifyAuth } = require("../middlewares/authMiddleware");
const { sendMessage, getCurrentChatMessages } = require("../controllers/messageControllers");

router.route("/").post(verifyAuth, sendMessage);
router.route("/:chatId").get(verifyAuth, getCurrentChatMessages);

module.exports = router;