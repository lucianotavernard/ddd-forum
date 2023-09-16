import { CommentOnPostUseCase } from './comment-on-post';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostCommentsRepository } from 'test/repositories/in-memory-post-comments-repository';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: CommentOnPostUseCase;

describe('Comment on Post', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository();

    sut = new CommentOnPostUseCase(
      inMemoryPostsRepository,
      inMemoryPostCommentsRepository,
    );
  });

  it('should be able to comment on post', async () => {
    const post = makePost();

    await inMemoryPostsRepository.create(post);

    await sut.execute({
      postId: post.id.toString(),
      authorId: post.authorId.toString(),
      content: 'Comment test',
    });

    expect(inMemoryPostCommentsRepository.items[0]).toMatchObject(
      expect.objectContaining({
        createdAt: expect.any(Date),
        updatedAt: undefined,
        content: 'Comment test',
        points: 0,
      }),
    );
  });

  it('should not be able to comment on non-existing post', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      authorId: 'author-1',
      content: 'Comment on non-existing post',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
