import { FetchRecentPostsUseCase } from './fetch-recent-posts';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: FetchRecentPostsUseCase;

describe('Fetch Recent Posts', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new FetchRecentPostsUseCase(inMemoryPostsRepository);
  });

  it('should be able to fetch recent posts', async () => {
    const author = makeAuthor();

    await inMemoryAuthorsRepository.create(author);

    await inMemoryPostsRepository.create(
      makePost({ authorId: author.id, createdAt: new Date(2022, 0, 20) }),
    );
    await inMemoryPostsRepository.create(
      makePost({ authorId: author.id, createdAt: new Date(2022, 0, 18) }),
    );
    await inMemoryPostsRepository.create(
      makePost({ authorId: author.id, createdAt: new Date(2022, 0, 23) }),
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
    const author = makeAuthor();

    await inMemoryAuthorsRepository.create(author);

    for (let i = 1; i <= 22; i++) {
      await inMemoryPostsRepository.create(makePost({ authorId: author.id }));
    }

    const result = await sut.execute({
      page: 2,
      per_page: 20,
    });

    expect(result.value?.posts).toHaveLength(2);
  });
});
