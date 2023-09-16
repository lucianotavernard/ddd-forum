import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type CommentProps = {
  authorId: UniqueEntityID;
  content: string;
  points: number;
  createdAt: Date;
  updatedAt?: Date;
};

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get points() {
    return this.props.points;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
