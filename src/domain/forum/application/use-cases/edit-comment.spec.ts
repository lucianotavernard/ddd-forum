import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { EditCommentUseCase } from './edit-comment';

import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { makeComment } from 'test/factories/make-comment';

let inMemoryCommentsRepository: InMemoryCommentsRepository;
let sut: EditCommentUseCase;

describe('Edit Comment', () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryCommentsRepository();
    sut = new EditCommentUseCase(inMemoryCommentsRepository);
  });

  it('should be able to edit a comment', async () => {
    const newComment = makeComment(
      {
        postId: new UniqueEntityID('1'),
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('comment-1'),
    );

    await inMemoryCommentsRepository.create(newComment);

    await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-1',
      content: 'New comment test',
    });

    expect(inMemoryCommentsRepository.items[0]).toMatchObject({
      content: 'New comment test',
    });
  });

  it('should not be able to edit a non-existing comment', async () => {
    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-2',
      content: 'Content test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a comment from another user', async () => {
    const newComment = makeComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('comment-1'),
    );

    await inMemoryCommentsRepository.create(newComment);

    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-2',
      content: 'Content test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
