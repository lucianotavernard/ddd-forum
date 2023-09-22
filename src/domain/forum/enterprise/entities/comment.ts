import { Optional } from '@/core/types/optional';

import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { CommentCreatedEvent } from '../events/comment-created-event';

export type CommentProps = {
  postId: UniqueEntityID;
  authorId: UniqueEntityID;
  commentId?: UniqueEntityID;
  content: string;
  points: number;
  createdAt: Date;
  updatedAt?: Date;
};

export class Comment extends AggregateRoot<CommentProps> {
  get postId() {
    return this.props.postId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get commentId() {
    return this.props.commentId;
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

  static create(
    props: Optional<CommentProps, 'createdAt' | 'points'>,
    id?: UniqueEntityID,
  ) {
    const comment = new Comment(
      {
        ...props,
        points: props.points ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewComment = !id;

    if (isNewComment) {
      comment.addDomainEvent(new CommentCreatedEvent(comment));
    }

    return comment;
  }
}
