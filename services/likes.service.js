const LikeRepository = require("../repositories/likes.repository");
const PostRepository = require("../repositories/posts.repository");
const Boom = require("boom");

class LikeService {
  constructor() {
    this.likeRepository = new LikeRepository();
    this.postRepository = new PostRepository();
  }

  // 좋아요한 게시글 찾기
  findLike = async (userId) => {
    const findLike = await this.likeRepository.find(userId);

    return findLike;
  };

  findLikePosts = async (findUser) => {
    const findLikesPost = await Promise.all(
      findUser.map(async (ele) => {
        const findPost = ele.postId;
        const findLike = await this.likeRepository.findAllPost(findPost);
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

  // 좋아요 등록 및 취소
  toggleLike = async (userId, postId) => {
    const existsPosts = await this.postRepository.findOnePost(postId);

    if (!existsPosts) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    try {
      const isLike = await this.likeRepository.findPostUserCheck(
        userId,
        postId
      );

      if (!isLike) {
        const addLike = this.likeRepository.addLike(postId, userId);
        const message = "게시글의 좋아요를 등록하였습니다.";
        addLike;
        return message;
      } else {
        const deleteLike = this.likeRepository.deleteLike(postId, userId);
        const message = "게시글의 좋아요를 취소하였습니다.";
        deleteLike;
        return message;
      }
    } catch (error) {
      throw Boom.badRequest("게시글 좋아요에 실패하였습니다.");
    }
  };
}

module.exports = LikeService;
