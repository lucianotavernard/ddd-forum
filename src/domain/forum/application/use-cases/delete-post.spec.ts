import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { DeletePostUseCase } from './delete-post';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let sut: DeletePostUseCase;

describe('Delete Post', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
    );

    sut = new DeletePostUseCase(inMemoryPostsRepository);
  });

  it('should be able to delete a post', async () => {
    const newPost = makePost(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('post-1'),
    );

    await inMemoryPostsRepository.create(newPost);

    await sut.execute({
      postId: 'post-1',
      authorId: 'author-1',
    });

    expect(inMemoryPostsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a non-existing post', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete a post from another user', async () => {
    const newPost = makePost(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('post-1'),
    );

    await inMemoryPostsRepository.create(newPost);

    const result = await sut.execute({
      postId: 'post-1',
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
