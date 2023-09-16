import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { DeletePostCommentUseCase } from './delete-post-comment';

import { InMemoryPostCommentsRepository } from 'test/repositories/in-memory-post-comments-repository';
import { makePostComment } from 'test/factories/make-post-comment';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: DeletePostCommentUseCase;

describe('Delete Post Comment', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new DeletePostCommentUseCase(inMemoryPostCommentsRepository);
  });

  it('should be able to delete a post comment', async () => {
    const postComment = makePostComment();

    await inMemoryPostCommentsRepository.create(postComment);

    await sut.execute({
      postCommentId: postComment.id.toString(),
      authorId: postComment.authorId.toString(),
    });

    expect(inMemoryPostCommentsRepository.items).toHaveLength(0);
  });

  it('should be able to delete a non-existing post comment', async () => {
    const result = await sut.execute({
      postCommentId: 'post-comment-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete another user post comment', async () => {
    const postComment = makePostComment({
      authorId: new UniqueEntityID('author-1'),
    });

    await inMemoryPostCommentsRepository.create(postComment);

    const result = await sut.execute({
      postCommentId: postComment.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
