const express = require("express");
const { verifyAuth } = require("../middlewares/authMiddleware");
const { 
    getOrCreateOneToOneChat,
    getAllCurrentUserChats,
    createGroup,
    renameGroup,
    addUserToGroup
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(verifyAuth, getOrCreateOneToOneChat).get(verifyAuth, getAllCurrentUserChats);
router.route("/group").post(verifyAuth, createGroup).put(verifyAuth,renameGroup);
router.route("/group/add").put(verifyAuth, addUserToGroup);

module.exports = router;