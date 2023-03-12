const PostService = require("../services/posts.service");
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

  // 하나의 Post를 가져온다.
  getOnePost = async (req, res, next) => {
    const { postId } = req.params;

    try {
      const findOne = await this.postService.getOnePost(postId);
      res.status(200).json({ post: findOne });
      return;
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

  // Post를 삭제한다.
  deleteOnePost = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    try {
      const post = await this.postService.deleteOne(postId, userId);

      res.status(200).json({ message: "게시글을 삭제하였습니다." });

      return post;
    } catch (error) {
      console.error(error);
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
}

module.exports = PostController;
