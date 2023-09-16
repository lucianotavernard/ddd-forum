import { SpyInstance } from 'vitest';

import { OnCommentCreated } from '@/domain/notification/application/subscribers/on-comment-created';

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostCommentsRepository } from 'test/repositories/in-memory-post-comments-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { makePostComment } from 'test/factories/make-post-comment';
import { makePost } from 'test/factories/make-post';
import { waitFor } from 'test/utils/wait-for';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Comment Created', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnCommentCreated(inMemoryPostsRepository, sendNotificationUseCase);
  });

  it.skip('should send a notification when a comment is created', async () => {
    const post = makePost();
    const comment = makePostComment({ postId: post.id });

    inMemoryPostsRepository.create(post);
    inMemoryPostCommentsRepository.create(comment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
