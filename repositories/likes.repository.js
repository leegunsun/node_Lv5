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

  findPostUserCheck = async (userId, postId) => {
    const findLikes = await Like.findOne({ postId: postId, userId: userId });

    return findLikes;
  };

  addLike = async (postId, userId) => {
    const addLike = new Like({ postId: postId, userId: userId });

    return await addLike.save();
  };

  deleteLike = async (postId, userId) => {
    const deleteLike = await Like.deleteOne({ postId: postId, userId: userId });

    return deleteLike;
  };

  findOnePost = async (postId) => {
    const findLikes = await Like.findOne({ postId: postId });

    return findLikes;
  };
}

module.exports = LikeRepository;
