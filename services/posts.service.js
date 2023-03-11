const PostRepository = require("../repositories/posts.repository");
const Boom = require("boom");

class PostService {
  constructor() {
    this.postRepository = new PostRepository();
  }

  // Post 스키마로 정의된 모든 포스트를 찾는다
  findAllPosts = async () => {
    const findAllPosts = await this.postRepository.findAllPosts();
    const assemblyPosts = await this.postRepository.assemblyPosts();

    if (findAllPosts.length) {
      return assemblyPosts;
    } else {
      throw Boom.preconditionFailed("데이터가 없습니다.");
    }
  };

  // Post 스키마 + likes + comment를 더한 값을 반환한다.
  assemblyPosts = async () => {
    const rename = await this.postRepository.assemblyPosts();

    return rename;
  };

  getFindOne = async (postId) => {
    const findOne = await this.postRepository.findOnePost(postId);
    return findOne;
  };

  // postId값을 가진 하나의 포스트를 찾는다.
  getOnePost = async (postId) => {
    const findOne = await this.postRepository.findOnePost(postId);
    const result = {
      postId: findOne.postId,
      userId: findOne.userId,
      nickname: findOne.nickname,
      title: findOne.title,
      content: findOne.content,
      createdAt: findOne.createdAt,
      updatedAt: findOne.updatedAt,
    };
    try {
      if (findOne) {
        return result;
      }
    } catch (error) {
      throw Boom.badRequest("게시글 조회에 실패하였습니다.");
    }
  };

  // Post를 작성한다.
  createPost = async (title, content, userId) => {
    const findOneUserNickName = await this.postRepository.findUserId(userId);
    const maxPostId = await this.postRepository.findSortPostId();
    const postId = maxPostId ? maxPostId.postId + 1 : 1;

    if (!title && !content) {
      throw Boom.preconditionFailed("데이터 형식이 올바르지 않습니다.");
    }

    if (!title) {
      throw Boom.preconditionFailed("게시글 제목의 형식이 일치하지 않습니다.");
    } else if (!content) {
      throw Boom.preconditionFailed("게시글 내용의 형식이 일치하지 않습니다.");
    }

    const createPostData = await this.postRepository.createPost(
      findOneUserNickName,
      title,
      content,
      userId,
      postId
    );

    return createPostData;
  };

  // Post를 수정한다.
  updatePost = async (post, title, content, userId) => {
    if (!title && !content) {
      throw Boom.preconditionFailed("데이터 형식이 올바르지 않습니다.");
    }

    if (userId !== post.userId) {
      throw Boom.preconditionFailed("게시글 수정의 권한이 존재하지 않습니다.");
    }

    if (!title) {
      throw Boom.preconditionFailed("게시글 제목의 형식이 일치하지 않습니다.");
    } else if (!content) {
      throw Boom.preconditionFailed("게시글 내용의 형식이 일치하지 않습니다.");
    }

    if (post) {
      const update = await this.postRepository.updatePost(post, title, content);
      return update;
    } else {
      throw Boom.preconditionFailed("게시글이 정상적으로 수정되지 않았습니다.");
    }
  };

  // Post를 삭제한다
  deleteOne = async (postId, userId) => {
    const post = await this.postRepository.findOnePost(postId);

    if (!post) {
      throw Boom.preconditionFailed("게시글이 존재하지 않습니다.");
    }

    if (post.userId == userId) {
      try {
        const deletePost = await this.postRepository.deletePost(postId);

        return deletePost;
      } catch (errer) {
        throw Boom.preconditionFailed(
          "게시글이 정상적으로 삭제되지 않았습니다."
        );
      }
    } else {
      throw Boom.preconditionFailed("게시글의 삭제 권한이 존재하지 않습니다.");
    }
  };
}

module.exports = PostService;
