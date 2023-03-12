const LikeService = require("../services/likes.service");
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
      res.status(400).json({ message: "좋아요 게시글 조회에 실패하였습니다." });
      console.error(error.message);
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
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        res
          .status(400)
          .json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
        console.error(error.message);
      }
    }
  };
}

module.exports = LikeController;
