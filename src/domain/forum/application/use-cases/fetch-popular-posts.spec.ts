import { FetchPopularPostsUseCase } from './fetch-popular-posts';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: FetchPopularPostsUseCase;

describe('Fetch Popular Posts', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new FetchPopularPostsUseCase(inMemoryPostsRepository);
  });

  it('should be able to fetch popular posts', async () => {
    const author = makeAuthor();

    await inMemoryAuthorsRepository.create(author);

    await inMemoryPostsRepository.create(
      makePost({ authorId: author.id, points: 20 }),
    );
    await inMemoryPostsRepository.create(
      makePost({ authorId: author.id, points: 18 }),
    );
    await inMemoryPostsRepository.create(
      makePost({ authorId: author.id, points: 23 }),
    );

    const result = await sut.execute({
      page: 1,
      per_page: 20,
    });

    expect(result.value?.posts).toEqual([
      expect.objectContaining({ points: 23 }),
      expect.objectContaining({ points: 20 }),
      expect.objectContaining({ points: 18 }),
    ]);
  });

  it('should be able to fetch paginated popular posts', async () => {
    const author = makeAuthor();

    await inMemoryAuthorsRepository.create(author);

    for (let i = 1; i <= 22; i++) {
      await inMemoryPostsRepository.create(
        makePost({ authorId: author.id, points: i * 4 }),
      );
    }

    const result = await sut.execute({
      page: 2,
      per_page: 20,
    });

    expect(result.value?.posts).toHaveLength(2);
  });
});
