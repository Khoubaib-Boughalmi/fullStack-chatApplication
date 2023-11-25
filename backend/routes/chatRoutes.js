const express = require("express");
const { verifyAuth } = require("../middlewares/authMiddleware");
const { 
    getOrCreateOneToOneChat,
    getAllCurrentUserChats,
    createGroupChat,
    renameGroup 
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(verifyAuth, getOrCreateOneToOneChat).get(verifyAuth, getAllCurrentUserChats);
router.route("/group").post(verifyAuth, createGroupChat).put(verifyAuth,renameGroup);

module.exports = router;