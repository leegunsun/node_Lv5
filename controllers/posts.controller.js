const PostService = require("../services/posts.service");
const logger = require("../config/winston");
const Boom = require("boom");

class PostController {
  constructor() {
    this.postService = new PostService();
  }

  // 모든 Post를 가져온다
  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postService.findAllPosts();
      res.status(200).json({ posts: posts });
      return;
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log("error", error.message);
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log("error", error.message);
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
      }
    }
  };

  // 하나의 Post를 가져온다.
  getOnePost = async (req, res, next) => {
    const { postId } = req.params;

    try {
      const findOne = await this.postService.getOnePost(postId);
      res.status(200).json({ post: findOne });
      return;
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log("error", `${error.message} / postId : ${postId}`);
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log("error", `${error.message} / postId : ${postId}`);
        res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
      }
    }
  };

  // Post를 생성한다.
  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const { userId } = res.locals.user;

    try {
      const newPost = await this.postService.createPost(title, content, userId);

      res.status(201).json({ message: "게시글 작성에 성공하였습니다." });

      return newPost;
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log("error", `${error.message} / userId : ${userId}`);
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log("error", `${error.message} / userId : ${userId}`);
        res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
      }
    }
  };

  // Post를 수정한다.
  updatePost = async (req, res, next) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals.user;

    try {
      const post = await this.postService.getFindOne(postId);

      const updatePost = await this.postService.updatePost(
        post,
        title,
        content,
        userId
      );
      res.status(200).json({ message: "게시글을 수정하였습니다." });
      return updatePost;
    } catch {
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
        res.status(400).json({ errorMessage: "게시글 수정에 실패하였습니다." });
      }
    }
  };

  // Post를 삭제한다.
  deleteOnePost = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    try {
      const post = await this.postService.deleteOne(postId, userId);

      res.status(200).json({ message: "게시글을 삭제하였습니다." });

      return post;
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
        res.status(400).json({ errorMessage: "게시글 삭제에 실패하였습니다." });
      }
    }
  };
}

module.exports = PostController;
