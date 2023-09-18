import { FetchRecentPostsUseCase } from './fetch-recent-posts';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;

let sut: FetchRecentPostsUseCase;

describe('Fetch Recent Posts', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    sut = new FetchRecentPostsUseCase(inMemoryPostsRepository);
  });

  it('should be able to fetch recent posts', async () => {
    await inMemoryPostsRepository.create(
      makePost({ createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryPostsRepository.create(
      makePost({ createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryPostsRepository.create(
      makePost({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
      per_page: 20,
    });

    expect(result.value?.posts).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent posts', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryPostsRepository.create(makePost());
    }

    const result = await sut.execute({
      page: 2,
      per_page: 20,
    });

    expect(result.value?.posts).toHaveLength(2);
  });
});
