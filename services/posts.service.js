const PostRepository = require("../repositories/posts.repository");

class PostService {
  constructor() {
    this.postRepository = new PostRepository();
  }

  // Post 스키마로 정의된 모든 포스트를 찾는다
  findAllPosts = async () => {
    const posts = await postRepository.findAllPosts();

    return posts;
  };

  // Post 스키마 + likes + comment를 더한 값을 반환한다.
  assemblyPosts = async () => {
    const rename = await postRepository.assemblyPosts();

    return rename;
  };

  // postId값을 가진 하나의 포스트를 찾는다.
  getOnePost = async (postId) => {
    const post = await postRepository.findOnePost({ postId: postId });
    const result = {
      postId: post.postId,
      userId: post.userId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return result;
  };

  // Post를 작성한다.
  createPost = async (title, content, userId) => {
    const findOneUserNickName = await this.postRepository.findUserId(userId);
    const maxPostId = await this.postRepository.findSortPostId();
    const postId = maxPostId ? maxPostId.userId + 1 : 1;
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
