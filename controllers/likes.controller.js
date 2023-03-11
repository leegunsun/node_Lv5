const LikeService = require("../services/likes.service");

class LikeController {
  constructor() {
    this.likeService = new LikeService();
  }

  searchLike = async (req, res, next) => {
    const { userId } = res.locals.user;
    const findUser = await this.likeService.findLike(userId);
    const findLikesPost = await this.likeService.findLikePosts(findUser);

    try {
      return res.status(200).json({ posts: findLikesPost });
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });
    }
  };

  toggleLike = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const existsPosts = await Post.findOne({ postId: postId });
  };
}

module.exports = LikeController;
