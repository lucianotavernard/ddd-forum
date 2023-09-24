import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { UpvoteOnPostUseCase } from './upvote-on-post';
import { PostService } from '@/domain/forum/application/services/post-service';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';
import { makePost } from 'test/factories/make-post';

let postService: PostService;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let sut: UpvoteOnPostUseCase;

describe('Upvote on Post', () => {
  beforeEach(() => {
    postService = new PostService();

    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new UpvoteOnPostUseCase(
      postService,
      inMemoryPostsRepository,
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );
  });

  it('should be able to upvote on post', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });

    await inMemoryAuthorsRepository.create(author);
    await inMemoryPostsRepository.create(post);

    await sut.execute({
      postId: post.id.toString(),
      authorId: post.authorId.toString(),
    });

    const result = inMemoryPostVotesRepository.items[0];
    const newVote = post.votes.currentItems[0];

    expect(post.votes.compareItems(newVote, result)).toBeTruthy();

    expect(result.isUpvote).toBeTruthy();
    expect(result.postId.equals(post.id)).toBeTruthy();
    expect(result.authorId.equals(post.authorId)).toBeTruthy();

    expect(result).toEqual(
      expect.objectContaining({
        createdAt: expect.any(Date),
        updatedAt: undefined,
      }),
    );
  });

  it('should not be able to upvote on non-existing post', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to upvote on post with non-existing author', async () => {
    const post = makePost();

    await inMemoryPostsRepository.create(post);

    const result = await sut.execute({
      postId: post.id.toString(),
      authorId: post.authorId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
