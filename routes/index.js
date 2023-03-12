const express = require("express");
const router = express.Router();

const authsRouter = require("./auths.route");
const postsRouter = require("./posts.route");
const likesRouter = require("./likes.router");
const commentsRouter = require("./comments.route");
const signupRouter = require("./signup.route");

router.use("/signup", signupRouter);
router.use("/auths", authsRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/likes", likesRouter);

module.exports = router;
