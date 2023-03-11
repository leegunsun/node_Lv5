const Like = require("../schemas/likes");

class LikeRepository {
  find = async (userId) => {
    const findLikes = await Like.find({ userId: userId });

    return findLikes;
  };

  findAllPost = async (postId) => {
    const findLikes = await Like.find({ postId: postId });

    return findLikes;
  };

  findOnePost = async (postId) => {
    const findLikes = await Like.findOne({ postId: postId });

    return findLikes;
  };
}

module.exports = LikeRepository;
