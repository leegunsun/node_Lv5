const User = require("../schemas/user.js");
const Comment = require("../schemas/comment.js");
const Likes = require("../schemas/likes.js");
const Post = require("../schemas/posts.js");

class PostRepository {
  // Post 스키마로 정의된 모든 포스트를 찾는다
  findAllPosts = async () => {
    const posts = await Post.find();

    return posts;
  };

  // Post 스키마 + likes + comment를 더한 값을 반환한다.
  assemblyPosts = async () => {
    const posts = await Post.find();
    const rename = await Promise.all(
      posts.map(async (ele) => {
        const likes = await Likes.find({ postId: ele.postId });
        const comments = await Comment.find({ postId: ele.postId });
        return {
          postId: ele.postId,
          userId: ele.userId,
          nickname: ele.nickname,
          title: ele.title,
          createdAt: ele.createdAt,
          comment: comments.length ? comments : [],
          likes: likes.length ? likes.length : 0,
        };
      })
    );

    return rename;
  };

  // Post테이블에서 postId값을 가진 하나의 포스트를 찾는다.
  findOnePost = async (postId) => {
    const post = await Post.findOne({ postId: postId });

    return post;
  };

  // User테이블에서 하나의 유저를 userId로 찾는다
  findUserId = async (userId) => {
    const user = await User.findOne({ userId });

    return user;
  };

  // Post테이블에서 postId의 정렬을 찾는다.
  findSortPostId = async () => {
    const maxPostId = await Post.findOne().sort("-postId").exec();

    return maxPostId;
  };

  // Post를 생성한다.
  createPost = async (nickname, title, content, userId, postId) => {
    const post = new Post({
      nickname: nickname.nickname,
      title,
      content,
      userId,
      postId,
    });

    return await post.save();
  };

  // Post를 수정한다.
  updatePost = async (post, title, content) => {
    post.title = title;
    post.content = content;

    return await post.save();
  };

  // Post를 삭제한다.
  deletePost = async (postId) => {
    const deleteOnePost = await Post.deleteOne({ postId: postId });

    return deleteOnePost;
  };
}

module.exports = PostRepository;
