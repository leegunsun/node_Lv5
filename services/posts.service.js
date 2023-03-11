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
    const rename = await postRepository.assemblyPosts();

    return rename;
  };

  // postId값을 가진 하나의 포스트를 찾는다.
  getOnePost = async (postId) => {
    const findOne = await postRepository.findOnePost({ postId: postId });
    const result = {
      postId: findOne.postId,
      userId: findOne.userId,
      nickname: findOne.nickname,
      title: findOne.title,
      content: findOne.content,
      createdAt: findOne.createdAt,
      updatedAt: findOne.updatedAt,
    };

    if (findOne) {
      return result;
    } else {
      throw Boom.badRequest("게시글 조회에 실패하였습니다.");
    }
  };

  // Post를 작성한다.
  createPost = async (title, content, userId) => {
    const findOneUserNickName = await this.postRepository.findUserId(userId);
    const maxPostId = await this.postRepository.findSortPostId();
    const postId = maxPostId ? maxPostId.userId + 1 : 1;

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

  // Post를 수정한다. //확인필요
  updatePost = async (post, title, content) => {
    const update = await this.postRepository.updatePost(post, title, content);

    return update;
  };

  // Post를 삭제한다
  deleteOne = async (postId) => {
    const deletePost = await this.postRepository.deletePost(postId);

    return deletePost;
  };
}

module.exports = PostService;
