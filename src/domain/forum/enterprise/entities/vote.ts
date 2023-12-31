import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type VoteType = 'UPVOTE' | 'DOWNVOTE';

export type VoteProps = {
  authorId: UniqueEntityID;
  type: VoteType;
  createdAt: Date;
  updatedAt?: Date;
};

export abstract class Vote<Props extends VoteProps> extends Entity<Props> {
  get authorId() {
    return this.props.authorId;
  }

  get type() {
    return this.props.type;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isUpvote() {
    return this.props.type === 'UPVOTE';
  }

  get isDownvote() {
    return this.props.type === 'DOWNVOTE';
  }
}
