import { Injectable } from '@nestjs/common';

import { Author } from '@/domain/forum/enterprise/entities/author';
import { Comment } from '@/domain/forum/enterprise/entities/comment';
import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';

@Injectable()
export class CommentService {
  public upvoteComment(
    comment: Comment,
    author: Author,
    votesOnCommentByAuthor: CommentVote[],
  ) {
    const existingUpvote = votesOnCommentByAuthor.find((v) => v.isUpvote);
    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      return false;
    }

    const existingDownvote = votesOnCommentByAuthor.find((v) => v.isDownvote);
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      comment.votes.remove(existingDownvote);
      comment.points = comment.points - 1;

      return false;
    }

    const upvote = CommentVote.createUpvote({
      authorId: author.id,
      commentId: comment.id,
    });

    comment.votes.add(upvote);
    comment.points = comment.points + 1;

    return true;
  }

  public downvoteComment(
    comment: Comment,
    author: Author,
    votesOnCommentByAuthor: CommentVote[],
  ) {
    const existingDownvote = votesOnCommentByAuthor.find((v) => v.isDownvote);
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      return false;
    }

    const existingUpvote = votesOnCommentByAuthor.find((v) => v.isUpvote);
    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      comment.votes.remove(existingUpvote);
      comment.points = comment.points + 1;

      return false;
    }

    const downvote = CommentVote.createDownvote({
      authorId: author.id,
      commentId: comment.id,
    });

    comment.votes.add(downvote);
    comment.points = comment.points - 1;

    return true;
  }
}
