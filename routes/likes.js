const authMiddleware = require("../middlewares/auth-middleware.js");
const express = require("express");
const router = express.Router();
const Post = require("../schemas/posts.js");
const Likes = require("../schemas/likes.js");

//좋아요 게시글 조회
// 게시글 상세 조회와 url 경로가 겹치기 때문에 /posts/like -> /post/like로 수정함
router.get("/post/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const findLikes = await Likes.find({ userId: userId });
  const findLikesPost = await Promise.all(
    findLikes.map(async (ele) => {
      const findPost = ele.postId;
      const likes = await Likes.find({ postId: ele.postId });
      const LP = await Post.findOne({ postId: findPost });
      const ttLP = {
        userId: LP.userId,
        postId: LP.postId,
        nickname: LP.nickname,
        title: LP.title,
        content: LP.content,
        likes: likes.length ? likes.length : 0,
        createdAt: LP.createdAt,
        updatedAt: LP.updatedAt,
      };
      return ttLP;
    })
  );

  try {
    res.json({ posts: findLikesPost });
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });
  }
});

//게시글 좋아요
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const existsPosts = await Post.findOne({ postId: postId });

  if (!existsPosts) {
    return res
      .status(404)
      .json({ errorMessage: "게시글이 존재하지 않습니다." });
  }

  try {
    const isLike = await Likes.findOne({
      postId: postId,
      userId: userId,
    });

    if (!isLike) {
      const addLike = new Likes({ postId: postId, userId: userId });

      await addLike.save();
      return res
        .status(200)
        .json({ message: "게시글의 좋아요를 등록하였습니다." });
    } else {
      await Likes.deleteOne({ postId: postId, userId: userId });
      return res
        .status(200)
        .json({ message: "게시글의 좋아요를 취소하였습니다." });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
  }
});

module.exports = router;
