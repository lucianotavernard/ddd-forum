import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchCommentsFromPostUseCase } from './fetch-post-comments-from-post';

import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { makeComment } from 'test/factories/make-comment';

let inMemoryCommentsRepository: InMemoryCommentsRepository;
let sut: FetchCommentsFromPostUseCase;

describe('Fetch Post Comments', () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryCommentsRepository();
    sut = new FetchCommentsFromPostUseCase(inMemoryCommentsRepository);
  });

  it('should be able to fetch comments from post', async () => {
    await inMemoryCommentsRepository.create(
      makeComment({
        postId: new UniqueEntityID('post-1'),
      }),
    );

    await inMemoryCommentsRepository.create(
      makeComment({
        postId: new UniqueEntityID('post-1'),
      }),
    );

    await inMemoryCommentsRepository.create(
      makeComment({
        postId: new UniqueEntityID('post-1'),
      }),
    );

    const result = await sut.execute({
      postId: 'post-1',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
  });

  it('should be able to fetch paginated comments from post', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeComment({
          postId: new UniqueEntityID('post-1'),
        }),
      );
    }

    const result = await sut.execute({
      postId: 'post-1',
      page: 2,
      per_page: 20,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
