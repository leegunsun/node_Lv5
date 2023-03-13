const LikeService = require("../services/likes.service");
const logger = require("../config/winston");
const Boom = require("boom");

class LikeController {
  constructor() {
    this.likeService = new LikeService();
  }

  // 좋아요한 게시물 찾기
  searchLike = async (req, res, next) => {
    const { userId } = res.locals.user;
    const findUser = await this.likeService.findLike(userId);
    const findLikesPost = await this.likeService.findLikePosts(findUser);

    try {
      return res.status(200).json({ posts: findLikesPost });
    } catch (error) {
      logger.log("error", `${error.message} / userId : ${userId}`);
      res.status(400).json({ message: "좋아요 게시글 조회에 실패하였습니다." });
    }
  };

  // 좋아요 등록 및 취소
  toggleLike = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    try {
      const toggle = await this.likeService.toggleLike(userId, postId);
      toggle;

      res.status(200).json({ message: toggle });
      return;
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
        res
          .status(400)
          .json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
      }
    }
  };
}

module.exports = LikeController;
