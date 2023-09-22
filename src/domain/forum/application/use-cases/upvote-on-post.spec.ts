import { UpvoteOnPostUseCase } from './upvote-on-post';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let sut: UpvoteOnPostUseCase;

describe('Upvote on Post', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository();

    sut = new UpvoteOnPostUseCase(
      inMemoryPostsRepository,
      inMemoryPostVotesRepository,
    );
  });

  it('should be able to upvote on post', async () => {
    const post = makePost();

    await inMemoryPostsRepository.create(post);

    await sut.execute({
      postId: post.id.toString(),
      authorId: post.authorId.toString(),
    });

    const result = inMemoryPostVotesRepository.items[0];

    expect(result.isUpVote).toBeTruthy();
    expect(result.postId.equals(post.id)).toBeTruthy();
    expect(result.authorId.equals(post.authorId)).toBeTruthy();
  });

  it('should not be able to upvote on non-existing post', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
