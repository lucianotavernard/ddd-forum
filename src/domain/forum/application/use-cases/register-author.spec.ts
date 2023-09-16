import { RegisterAuthorUseCase } from './register-author';

import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { UsernameAlreadyExistsError } from './errors/username-already-exists';

import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAuthor } from 'test/factories/make-author';

let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let fakeHasher: FakeHasher;

let sut: RegisterAuthorUseCase;

describe('Register Author', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterAuthorUseCase(inMemoryAuthorsRepository, fakeHasher);
  });

  it('should be able to register a new author', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      author: inMemoryAuthorsRepository.items[0],
    });
  });

  it('should be able to hash author upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'johndoe',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryAuthorsRepository.items[0].password).toEqual(hashedPassword);
  });

  it('should not be able to register a new author with invalid email', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john',
      username: 'johndoe',
      password: '123',
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not be able to register a new author with invalid username', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'jo',
      password: '123',
    });

    expect(result.isLeft()).toBeTruthy();
  });

  it('should not be able to register new author with existing email', async () => {
    const author = makeAuthor({ email: 'john@doe.com' });

    inMemoryAuthorsRepository.create(author);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new EmailAlreadyExistsError('john@doe.com'));
  });

  it('should not be able to register new author with existing username', async () => {
    const author = makeAuthor({ username: 'johndoe' });

    inMemoryAuthorsRepository.create(author);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'jane@doe.com',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new UsernameAlreadyExistsError('johndoe'));
  });
});
