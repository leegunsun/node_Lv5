const Comment = require("../schemas/comment");

class CommentsRepository {
  // Comment테이블에서 commentId값을 가진 하나의 Comment를 찾는다.
  findOneComment = async (commentId) => {
    const post = await Comment.findOne({ commentId: commentId });

    return post;
  };

  // Comment테이블에서 CommentId의 정렬을 찾는다.
  findSortCommentId = async () => {
    const maxCommentId = await Comment.findOne().sort("-commentId").exec();

    return maxCommentId;
  };

  // createdAt을 기준으로 내림차순 정렬한 Comment를 반환한다.
  findComment = async (postId) => {
    const findComment = await Comment.find(
      { postId: postId },
      {
        commentId: 1,
        userId: 1,
        nickname: 1,
        comment: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).sort("-createdAt");

    return findComment;
  };

  // Commet를 생성한다.
  createComment = async (user, userId, postId, commentId, comment) => {
    const addComment = new Comment({
      comment,
      nickname: user.nickname,
      userId,
      postId,
      commentId: commentId,
    });

    return await addComment.save();
  };

  // Comment를 수정한다.
  updateComment = async (findComment, comment) => {
    findComment.comment = comment;

    return await findComment.save();
  };

  // Comment를 삭제한다.
  deleteComment = async (commentId) => {
    const deleteOneComment = await Comment.deleteOne({ commentId: commentId });

    return deleteOneComment;
  };
}

module.exports = CommentsRepository;
