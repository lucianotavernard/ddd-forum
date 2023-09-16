import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchPostCommentsUseCase } from './fetch-post-comments';

import { InMemoryPostCommentsRepository } from 'test/repositories/in-memory-post-comments-repository';
import { makePostComment } from 'test/factories/make-post-comment';

let inMemoryPostCommentsRepository: InMemoryPostCommentsRepository;
let sut: FetchPostCommentsUseCase;

describe('Fetch Post Comments', () => {
  beforeEach(() => {
    inMemoryPostCommentsRepository = new InMemoryPostCommentsRepository();
    sut = new FetchPostCommentsUseCase(inMemoryPostCommentsRepository);
  });

  it('should be able to fetch post comments', async () => {
    await inMemoryPostCommentsRepository.create(
      makePostComment({
        postId: new UniqueEntityID('post-1'),
      }),
    );

    await inMemoryPostCommentsRepository.create(
      makePostComment({
        postId: new UniqueEntityID('post-1'),
      }),
    );

    await inMemoryPostCommentsRepository.create(
      makePostComment({
        postId: new UniqueEntityID('post-1'),
      }),
    );

    const result = await sut.execute({
      postId: 'post-1',
      page: 1,
    });

    expect(result.value?.postComments).toHaveLength(3);
  });

  it('should be able to fetch paginated post comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryPostCommentsRepository.create(
        makePostComment({
          postId: new UniqueEntityID('post-1'),
        }),
      );
    }

    const result = await sut.execute({
      postId: 'post-1',
      page: 2,
      per_page: 20,
    });

    expect(result.value?.postComments).toHaveLength(2);
  });
});
