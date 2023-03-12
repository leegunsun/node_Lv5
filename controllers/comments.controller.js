const CommentsService = require("../services/comments.service");
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
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
        console.error(error.message);
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
        res.status(
          error
            .status(error.output.statusCode)
            .json({ errorMessage: error.output.payload.message })
        );
      } else {
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
        console.error(error.message);
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
        res.status(
          error
            .status(error.output.statusCode)
            .json({ errorMessage: error.output.payload.message })
        );
      } else {
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
        console.error(error.message);
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
        res.status(
          error
            .status(error.output.statusCode)
            .json({ errorMessage: error.output.payload.message })
        );
      } else {
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
        console.error(error.message);
      }
    }
  };
}

module.exports = CommentsController;
