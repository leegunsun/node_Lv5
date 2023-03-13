const CommentsService = require("../services/comments.service");
const logger = require("../config/winston");
const Boom = require("boom");

class CommentsController {
  constructor() {
    this.commentsService = new CommentsService();
  }

  // Comment 수정
  updateComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user;

    try {
      const updateComment = await this.commentsService.updateComment(
        userId,
        postId,
        commentId,
        comment
      );

      updateComment;
      return res.status(200).json({ message: updateComment });
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log(
          "error",
          `${error.message} / userId : ${userId} / postId : ${postId} / commentId : ${commentId}`
        );
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log(
          "error",
          `${error.message} / userId : ${userId} / postId : ${postId} / commentId : ${commentId}`
        );
        res.status(400).json({ errorMessage: "댓글 수정에 실패하였습니다." });
      }
    }
  };

  // Comment 가져오기
  getComments = async (req, res, next) => {
    const { postId } = req.params;

    try {
      const getComments = await this.commentsService.getComments(postId);
      getComments;
      return res.status(200).json({ comments: getComments });
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log("error", `${error.message} / postId : ${postId}`);
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log("error", `${error.message} / postId : ${postId}`);
        res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다." });
      }
    }
  };

  // Comment 생성
  createComment = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { comment } = req.body;
    const { postId } = req.params;

    try {
      const createComment = await this.commentsService.createComment(
        userId,
        postId,
        comment
      );
      createComment;
      return res.status(200).json({ message: createComment });
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log(
          "error",
          `${error.message} / userId : ${userId} / postId : ${postId}`
        );
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log(
          "error",
          `${error.message} / userId : ${userId} / postId : ${postId}`
        );
        res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
      }
    }
  };

  // Comment 삭제
  deleteOneComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user;

    try {
      const deleteOne = await this.commentsService.deleteComment(
        userId,
        postId,
        commentId,
        comment
      );
      deleteOne;

      return res.status(200).json({ message: deleteOne });
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log(
          "error",
          `${error.message} / userId : ${userId} / postId : ${postId} / commentId : ${commentId}`
        );
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log(
          "error",
          `${error.message} / userId : ${userId} / postId : ${postId} / commentId : ${commentId}`
        );
        res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다." });
      }
    }
  };
}

module.exports = CommentsController;
