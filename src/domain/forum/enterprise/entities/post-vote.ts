import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Vote, VoteType, VoteProps } from './vote';

export type PostVoteType = VoteType;

export interface PostProps extends VoteProps {
  postId: UniqueEntityID;
}

export class PostVote extends Vote<PostProps> {
  get postId() {
    return this.props.postId;
  }

  static create(props: Optional<PostProps, 'createdAt'>, id?: UniqueEntityID) {
    const vote = new PostVote(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return vote;
  }
}
