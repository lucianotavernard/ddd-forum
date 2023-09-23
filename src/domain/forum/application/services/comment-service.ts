import { Injectable } from '@nestjs/common';

import { right } from '@/core/either';

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
      return right(undefined);
    }

    const existingDownvote = votesOnCommentByAuthor.find((v) => v.isDownvote);
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      comment.votes.remove(existingDownvote);

      return right(undefined);
    }

    const upvote = CommentVote.createUpvote({
      authorId: author.id,
      commentId: comment.id,
    });

    comment.votes.add(upvote);

    return right(undefined);
  }

  public downvoteComment(
    comment: Comment,
    author: Author,
    votesOnCommentByAuthor: CommentVote[],
  ) {
    const existingDownvote = votesOnCommentByAuthor.find((v) => v.isDownvote);
    const downvoteAlreadyExists = !!existingDownvote;

    if (downvoteAlreadyExists) {
      return right(undefined);
    }

    const existingUpvote = votesOnCommentByAuthor.find((v) => v.isUpvote);
    const upvoteAlreadyExists = !!existingUpvote;

    if (upvoteAlreadyExists) {
      comment.votes.remove(existingUpvote);

      return right(undefined);
    }

    const downvote = CommentVote.createDownvote({
      authorId: author.id,
      commentId: comment.id,
    });

    comment.votes.add(downvote);

    return right(undefined);
  }
}
