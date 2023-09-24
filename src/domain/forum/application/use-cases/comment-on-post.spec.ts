import { CommentOnPostUseCase } from './comment-on-post';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryCommentVotesRepository } from 'test/repositories/in-memory-comment-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryCommentVotesRepository: InMemoryCommentVotesRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: CommentOnPostUseCase;

describe('Comment on Post', () => {
  beforeEach(() => {
    inMemoryCommentVotesRepository = new InMemoryCommentVotesRepository();
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryCommentVotesRepository,
    );

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new CommentOnPostUseCase(
      inMemoryPostsRepository,
      inMemoryCommentsRepository,
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

    expect(inMemoryCommentsRepository.items[0]).toMatchObject(
      expect.objectContaining({
        createdAt: expect.any(Date),
        updatedAt: undefined,
        commentId: undefined,
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
