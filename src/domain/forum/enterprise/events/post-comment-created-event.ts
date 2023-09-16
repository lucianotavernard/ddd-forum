import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';

export class PostCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public postComment: PostComment;

  constructor(postComment: PostComment) {
    this.postComment = postComment;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.postComment.id;
  }
}
