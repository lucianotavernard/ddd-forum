import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { DeleteCommentUseCase } from './delete-comment';

import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { makeComment } from 'test/factories/make-comment';

let inMemoryCommentsRepository: InMemoryCommentsRepository;
let sut: DeleteCommentUseCase;

describe('Delete Post Comment', () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryCommentsRepository();
    sut = new DeleteCommentUseCase(inMemoryCommentsRepository);
  });

  it('should be able to delete a comment', async () => {
    const comment = makeComment();

    await inMemoryCommentsRepository.create(comment);

    await sut.execute({
      commentId: comment.id.toString(),
      authorId: comment.authorId.toString(),
    });

    expect(inMemoryCommentsRepository.items).toHaveLength(0);
  });

  it('should be able to delete a non-existing comment', async () => {
    const result = await sut.execute({
      commentId: 'post-comment-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete another user comment', async () => {
    const comment = makeComment({
      authorId: new UniqueEntityID('author-1'),
    });

    await inMemoryCommentsRepository.create(comment);

    const result = await sut.execute({
      commentId: comment.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
