import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { GetAuthorByUsernameUseCase } from './get-author-by-username';

import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';

let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: GetAuthorByUsernameUseCase;

describe('Get Author By Username', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    sut = new GetAuthorByUsernameUseCase(inMemoryAuthorsRepository);
  });

  it('should be able to get a author by username', async () => {
    const newAuthor = makeAuthor({ username: 'johndoe' });

    await inMemoryAuthorsRepository.create(newAuthor);

    const result = await sut.execute({
      username: 'johndoe',
    });

    expect(result.value).toMatchObject({
      author: expect.objectContaining({
        name: newAuthor.name,
      }),
    });
  });

  it('should not be able to get a non-existing author by username', async () => {
    const result = await sut.execute({
      username: 'johndoe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
