const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware.js");

const LikeController = require("../controllers/likes.controller");
const likeController = new LikeController();

router.get("/", authMiddleware, likeController.searchLike);

router.put("/post/:postId", authMiddleware, likeController.toggleLike);

module.exports = router;
