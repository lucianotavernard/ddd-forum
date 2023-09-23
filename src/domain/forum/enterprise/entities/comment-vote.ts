import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Vote, VoteProps, VoteType } from './vote';

export type CommentVoteType = VoteType;

export interface CommentProps extends VoteProps {
  commentId: UniqueEntityID;
}

export class CommentVote extends Vote<CommentProps> {
  get commentId() {
    return this.props.commentId;
  }

  static create(
    props: Optional<CommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const vote = new CommentVote(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return vote;
  }

  static createUpvote(
    props: Optional<Omit<CommentProps, 'type'>, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const vote = new CommentVote(
      {
        ...props,
        type: 'UPVOTE',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return vote;
  }

  static createDownvote(
    props: Optional<Omit<CommentProps, 'type'>, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const vote = new CommentVote(
      {
        ...props,
        type: 'DOWNVOTE',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return vote;
  }
}
