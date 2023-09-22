import { UpvoteOnCommentUseCase } from './upvote-on-comment';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryCommentVotesRepository } from 'test/repositories/in-memory-comment-votes-repository';
import { makeComment } from 'test/factories/make-comment';

let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryCommentVotesRepository: InMemoryCommentVotesRepository;
let sut: UpvoteOnCommentUseCase;

describe('Upvote on Comment', () => {
  beforeEach(() => {
    inMemoryCommentVotesRepository = new InMemoryCommentVotesRepository();
    inMemoryCommentsRepository = new InMemoryCommentsRepository();

    sut = new UpvoteOnCommentUseCase(
      inMemoryCommentsRepository,
      inMemoryCommentVotesRepository,
    );
  });

  it('should be able to upvote on comment', async () => {
    const comment = makeComment();

    await inMemoryCommentsRepository.create(comment);

    await sut.execute({
      commentId: comment.id.toString(),
      authorId: comment.authorId.toString(),
    });

    const result = inMemoryCommentVotesRepository.items[0];

    expect(result.isUpVote).toBeTruthy();
    expect(result.commentId.equals(comment.id)).toBeTruthy();
    expect(result.authorId.equals(comment.authorId)).toBeTruthy();
  });

  it('should not be able to upvote on non-existing comment', async () => {
    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
