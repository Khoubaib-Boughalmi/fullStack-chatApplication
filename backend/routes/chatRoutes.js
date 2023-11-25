const express = require("express");
const { verifyAuth } = require("../middlewares/authMiddleware");
const { getOrCreateOneToOneChat, getAllCurrentUserChats } = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(verifyAuth, getOrCreateOneToOneChat).get(verifyAuth, getAllCurrentUserChats);

module.exports = router;