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

  set type(type: VoteType) {
    this.props.type = type;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isUpVote() {
    return this.props.type === 'UPVOTE';
  }

  get isDownVote() {
    return this.props.type === 'DOWNVOTE';
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
