import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { EditCommentOnPostUseCase } from './edit-comment-on-post';

import { InMemoryPostCommentsRepository } from 'test/repositories/in-memory-post-comments-repository';
import { makePostComment } from 'test/factories/make-post-comment';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: EditCommentOnPostUseCase;

describe('Edit Comment on Post', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new EditCommentOnPostUseCase(inMemoryPostCommentsRepository);
  });

  it('should be able to edit a comment on post', async () => {
    const newPostComment = makePostComment(
      {
        postId: new UniqueEntityID('post-1'),
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('post-comment-1'),
    );

    await inMemoryPostCommentsRepository.create(newPostComment);

    await sut.execute({
      postCommentId: 'post-comment-1',
      authorId: 'author-1',
      content: 'New comment test',
    });

    expect(inMemoryPostCommentsRepository.items[0]).toMatchObject({
      content: 'New comment test',
    });
  });

  it('should not be able to edit a non-existing comment on post', async () => {
    const result = await sut.execute({
      postCommentId: 'post-comment-1',
      authorId: 'author-2',
      content: 'Content test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a comment from another user', async () => {
    const newPostComment = makePostComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('post-comment-1'),
    );

    await inMemoryPostCommentsRepository.create(newPostComment);

    const result = await sut.execute({
      postCommentId: 'post-comment-1',
      authorId: 'author-2',
      content: 'Content test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
