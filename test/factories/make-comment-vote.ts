import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  CommentVote,
  CommentVoteProps,
} from '@/domain/forum/enterprise/entities/comment-vote';

export function makeCommentUpvote(
  override: Partial<CommentVoteProps> = {},
  id?: UniqueEntityID,
) {
  const vote = CommentVote.create(
    {
      authorId: override.authorId ?? new UniqueEntityID(),
      commentId: override.commentId ?? new UniqueEntityID(),
      type: 'UPVOTE',
    },
    id,
  );

  return vote;
}

export function makeCommentDownvote(
  override: Partial<CommentVoteProps> = {},
  id?: UniqueEntityID,
) {
  const vote = CommentVote.create(
    {
      authorId: override.authorId ?? new UniqueEntityID(),
      commentId: override.commentId ?? new UniqueEntityID(),
      type: 'DOWNVOTE',
    },
    id,
  );

  return vote;
}
