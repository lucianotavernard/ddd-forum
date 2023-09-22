import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';

import { Comment } from '../entities/comment';

export class CommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public comment: Comment;

  constructor(comment: Comment) {
    this.ocurredAt = new Date();
    this.comment = comment;
  }

  getAggregateId(): UniqueEntityID {
    return this.comment.id;
  }
}
