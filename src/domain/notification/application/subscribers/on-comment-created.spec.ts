import { SpyInstance } from 'vitest';

import { OnCommentCreated } from '@/domain/notification/application/subscribers/on-comment-created';

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryCommentVotesRepository } from 'test/repositories/in-memory-comment-votes-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeComment } from 'test/factories/make-comment';
import { makePost } from 'test/factories/make-post';
import { waitFor } from 'test/utils/wait-for';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryCommentVotesRepository: InMemoryCommentVotesRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Comment Created', () => {
  beforeEach(() => {
    inMemoryCommentVotesRepository = new InMemoryCommentVotesRepository();
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryCommentVotesRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnCommentCreated(inMemoryPostsRepository, sendNotificationUseCase);
  });

  it('should send a notification when a comment is created', async () => {
    const post = makePost();
    const comment = makeComment({ postId: post.id });

    inMemoryPostsRepository.create(post);
    inMemoryCommentsRepository.create(comment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
