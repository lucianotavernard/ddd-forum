import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { EditPostUseCase } from './edit-post';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let sut: EditPostUseCase;

describe('Edit Post', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
    );

    sut = new EditPostUseCase(inMemoryPostsRepository);
  });

  it('should be able to edit a post', async () => {
    const newPost = makePost(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('post-1'),
    );

    await inMemoryPostsRepository.create(newPost);

    await sut.execute({
      postId: newPost.id.toValue(),
      authorId: 'author-1',
      title: 'Post test',
      content: 'Content test',
    });

    expect(inMemoryPostsRepository.items[0]).toMatchObject({
      title: 'Post test',
      content: 'Content test',
    });
  });

  it('should not be able to edit a non-existing post', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      authorId: 'author-2',
      title: 'Post test',
      content: 'Content test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a post from another user', async () => {
    const newPost = makePost(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('post-1'),
    );

    await inMemoryPostsRepository.create(newPost);

    const result = await sut.execute({
      postId: newPost.id.toValue(),
      authorId: 'author-2',
      title: 'Post test',
      content: 'Content test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
