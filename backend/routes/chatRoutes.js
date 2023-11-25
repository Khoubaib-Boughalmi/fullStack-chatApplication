const express = require("express");
const { verifyAuth } = require("../middlewares/authMiddleware");
const { getOrCreateOneToOneChat, getAllCurrentUserChats, createGroupChat } = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(verifyAuth, getOrCreateOneToOneChat).get(verifyAuth, getAllCurrentUserChats);
router.route("/group").post(verifyAuth, createGroupChat);

module.exports = router;