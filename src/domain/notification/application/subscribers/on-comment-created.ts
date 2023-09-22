import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';

import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { CommentCreatedEvent } from '@/domain/forum/enterprise/events/comment-created-event';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

export class OnCommentCreated implements EventHandler {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewCommentNotification.bind(this),
      CommentCreatedEvent.name,
    );
  }

  private async sendNewCommentNotification({ comment }: CommentCreatedEvent) {
    const post = await this.postRepository.findById(comment.postId.toString());

    if (post) {
      await this.sendNotification.execute({
        recipientId: post.authorId.toString(),
        title: `New comment on "${post.title.substring(0, 40).concat('...')}"`,
        content: comment.excerpt,
      });
    }
  }
}
