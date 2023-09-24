import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  PostVote,
  PostVoteProps,
} from '@/domain/forum/enterprise/entities/post-vote';

export function makePostUpvote(
  override: Partial<PostVoteProps> = {},
  id?: UniqueEntityID,
) {
  const vote = PostVote.create(
    {
      authorId: override.authorId ?? new UniqueEntityID(),
      postId: override.postId ?? new UniqueEntityID(),
      type: 'UPVOTE',
    },
    id,
  );

  return vote;
}

export function makePostDownvote(
  override: Partial<PostVoteProps> = {},
  id?: UniqueEntityID,
) {
  const vote = PostVote.create(
    {
      authorId: override.authorId ?? new UniqueEntityID(),
      postId: override.postId ?? new UniqueEntityID(),
      type: 'DOWNVOTE',
    },
    id,
  );

  return vote;
}
