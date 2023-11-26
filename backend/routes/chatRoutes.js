const express = require("express");
const { verifyAuth } = require("../middlewares/authMiddleware");
const { 
    getOrCreateOneToOneChat,
    getAllCurrentUserChats,
    createGroup,
    renameGroup,
    addUserToGroup,
    removeUserFromGroup
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(verifyAuth, getOrCreateOneToOneChat).get(verifyAuth, getAllCurrentUserChats);
router.route("/group").post(verifyAuth, createGroup).put(verifyAuth,renameGroup);
router.route("/group/add").put(verifyAuth, addUserToGroup);
router.route("/group/remove").put(verifyAuth, removeUserFromGroup);

module.exports = router;