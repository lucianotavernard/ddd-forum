import { AuthenticateAuthorUseCase } from './authenticate-author';

import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { FakeEncrypter } from 'test/providers/fake-encrypter';
import { FakeHasher } from 'test/providers/fake-hasher';
import { makeAuthor } from 'test/factories/make-author';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateAuthorUseCase;

describe('Authenticate Author', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateAuthorUseCase(
      inMemoryAuthorsRepository,
      fakeHasher,
      encrypter,
    );
  });

  it('should be able to authenticate a author', async () => {
    const author = makeAuthor({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryAuthorsRepository.create(author);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate with invalid e-mail', async () => {
    const result = await sut.execute({
      email: 'invalid@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new WrongCredentialsError());
  });

  it('should not be able to authenticate with invalid password', async () => {
    const author = makeAuthor({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryAuthorsRepository.create(author);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new WrongCredentialsError());
  });
});
