const CommentsRepository = require("../repositories/comments.repository");
const PostsRepository = require("../repositories/posts.repository");
const AuthRepository = require("../repositories/auths.repository");
const Boom = require("boom");

class CommentsService {
  constructor() {
    this.commentsRepository = new CommentsRepository();
    this.postsRepository = new PostsRepository();
    this.authRepository = new AuthRepository();
  }

  updateComment = async (userId, postId, commentId, comment) => {
    const post = await this.postsRepository.findOnePost(postId);
    const findComment = await this.commentsRepository.findOneComment(commentId);

    // postId를 조회해서 게시글의 존재 여부 확인
    if (!post) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    //댓글의 존재 여부 확인
    if (!findComment) {
      throw Boom.notFound("댓글이 존재하지 않습니다.");
    }

    // 쿠키의 유저 아이디와 commentId 댓글의 유저 아이디를 비교해서 일치 여부 확인
    if (userId !== findComment.userId) {
      throw Boom.forbidden("댓글의 수정 권한이 존재하지 않습니다.");
    }

    // 작성 할 때 코멘트가 비어있는지 확인
    if (!comment) {
      throw Boom.badRequest("데이터 형식이 올바르지 않습니다.");
    }

    try {
      const updateComment = await this.commentsRepository.updateComment(
        findComment,
        comment
      );
      const message = "댓글을 수정하였습니다.";

      updateComment;

      return message;
    } catch (err) {
      throw Boom.badRequest("댓글 수정이 정상적으로 처리되지 않았습니다.");
    }
  };

  getComments = async (postId) => {
    const post = await this.postsRepository.findOnePost(postId);
    const comments = await this.commentsRepository.findComment(postId);

    if (!post) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    return comments;
  };

  createComment = async (userId, postId, comment) => {
    const post = await this.postsRepository.findOnePost(postId);
    const user = await this.authRepository.findOneUserId(userId);

    const maxCommentId = await this.commentsRepository.findSortCommentId();
    const commentId = maxCommentId ? maxCommentId.commentId + 1 : 1;

    if (!post) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    if (!comment) {
      throw Boom.preconditionFailed("댓글 내용을 입력해주세요.");
    }

    const createComment = await this.commentsRepository.createComment(
      user,
      userId,
      postId,
      commentId,
      comment
    );
    const message = "댓글을 작성하였습니다.";

    createComment;
    return message;
  };

  deleteComment = async (userId, postId, commentId, comment) => {
    const findComment = await this.commentsRepository.findOneComment(commentId);
    const post = await this.postsRepository.findOnePost(postId);

    // postId를 조회해서 게시글의 존재 여부 확인
    if (!post) {
      throw Boom.notFound("게시글이 존재하지 않습니다.");
    }

    //댓글의 존재 여부 확인
    if (!findComment) {
      throw Boom.notFound("댓글이 존재하지 않습니다.");
    }

    // 쿠키의 유저 아이디와 commentId 댓글의 유저 아이디를 비교해서 일치 여부 확인
    if (userId !== findComment.userId) {
      throw Boom.forbidden("댓글의 삭제 권한이 존재하지 않습니다.");
    }

    // 작성 할 때 코멘트가 비어있는지 확인
    if (!comment) {
      throw Boom.badRequest("데이터 형식이 올바르지 않습니다.");
    }

    try {
      const deleteOne = await this.commentsRepository.deleteComment(commentId);
      const message = "댓글을 삭제하였습니다.";
      deleteOne;
      return message;
    } catch (err) {
      throw Boom.badRequest("댓글 삭제가 정상적으로 처리되지 않았습니다.");
    }
  };
}

module.exports = CommentsService;
