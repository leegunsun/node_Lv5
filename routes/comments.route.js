const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

// 댓글 목록 조회
router.get("/:postId/comments", commentsController.getComments);

// 포스트에 댓글 등록
router.post(
  "/:postId/comments",
  authMiddleware,
  commentsController.createComment
);

// 포스트에 댓글 수정
router.put(
  "/:postId/comments/:commentId",
  authMiddleware,
  commentsController.updateComment
);

// 포스트에 댓글 삭제
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  commentsController.deleteOneComment
);

module.exports = router;
