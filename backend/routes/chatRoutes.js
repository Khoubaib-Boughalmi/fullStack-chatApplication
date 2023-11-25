const express = require("express");
const { verifyAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(verifyAuth, accessChat);