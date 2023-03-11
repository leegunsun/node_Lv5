const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const PostController = require("../controllers/posts.controller");
const postController = new PostController();

router.get("/", postController.getPosts);
router.get("/:postId", postController.getOnePost);

router.post("/", authMiddleware, postController.createPost);

router.put("/:postId", authMiddleware, postController.updatePost);

router.delete("/:postId", authMiddleware, postController.deleteOnePost);

module.exports = router;
