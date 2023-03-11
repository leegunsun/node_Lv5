const LikeRepository = require("../repositories/likes.repository");
const PostRepository = require("../repositories/posts.repository");

class LikeService {
  constructor() {
    this.likeRepository = new LikeRepository();
    this.postRepository = new PostRepository();
  }

  findLike = async (userId) => {
    const findLike = await this.likeRepository.find({ userId: userId });

    return findLike;
  };

  findLikePosts = async (findUser) => {
    const findLikesPost = await Promise.all(
      findUser.map(async (ele) => {
        const findPost = ele.postId;
        const findLike = await this.likeRepository.findAllpost(ele.postId);
        const LP = await this.postRepository.findOnePost(findPost);
        const ttLP = {
          userId: LP.userId,
          postId: LP.postId,
          nickname: LP.nickname,
          title: LP.title,
          content: LP.content,
          likes: findLike.length ? findLike.length : 0,
          createdAt: LP.createdAt,
          updatedAt: LP.updatedAt,
        };
        return ttLP;
      })
    );

    return findLikesPost;
  };
}

module.exports = LikeService;
