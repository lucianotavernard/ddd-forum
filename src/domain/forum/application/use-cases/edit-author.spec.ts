import { EditAuthorUseCase } from './edit-author';

import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { UsernameAlreadyExistsError } from './errors/username-already-exists';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { InvalidEmailError } from '@/domain/forum/enterprise/entities/value-objects/errors/invalid-email-error';
import { InvalidUsernameError } from '@/domain/forum/enterprise/entities/value-objects/errors/invalid-username-error';

import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';

let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: EditAuthorUseCase;

describe('Edit Author', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    sut = new EditAuthorUseCase(inMemoryAuthorsRepository);
  });

  it('should be able to edit a author', async () => {
    const newAuthor = makeAuthor(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('author-1'),
    );

    await inMemoryAuthorsRepository.create(newAuthor);

    await sut.execute({
      authorId: newAuthor.id.toValue(),
      name: 'Jane Doe',
      email: 'jane@doe.com',
      username: 'johndoe',
    });

    expect(inMemoryAuthorsRepository.items[0].name).toBe('Jane Doe');
    expect(inMemoryAuthorsRepository.items[0].email.value).toBe('jane@doe.com');
  });

  it('should not be able to edit author with an invalid email', async () => {
    const newAuthor = makeAuthor(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('author-1'),
    );

    await inMemoryAuthorsRepository.create(newAuthor);

    const result = await sut.execute({
      authorId: 'author-1',
      name: 'Jane Doe',
      email: 'jane',
      username: 'johndoe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
  });

  it('should not be able to edit author with an invalid username', async () => {
    const newAuthor = makeAuthor(
      {
        name: 'John Doe',
      },
      new UniqueEntityID('author-1'),
    );

    await inMemoryAuthorsRepository.create(newAuthor);

    const result = await sut.execute({
      authorId: 'author-1',
      name: 'Jane Doe',
      email: 'jane@doe.com',
      username: 'jo',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidUsernameError);
  });

  it('should not be able to edit a non-existing author', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      name: 'Jane Doe',
      email: 'jane@doe.com',
      username: 'johndoe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit an author with the same email as another', async () => {
    const john = makeAuthor(
      {
        email: 'john@doe.com',
      },
      new UniqueEntityID('author-1'),
    );

    const jane = makeAuthor(
      {
        email: 'jane@doe.com',
      },
      new UniqueEntityID('author-2'),
    );

    await inMemoryAuthorsRepository.create(john);
    await inMemoryAuthorsRepository.create(jane);

    const result = await sut.execute({
      authorId: 'author-1',
      name: 'John Doe',
      email: 'jane@doe.com',
      username: 'johndoe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError);
  });

  it('should not be able to edit an author with the same username as another', async () => {
    const john = makeAuthor(
      {
        email: 'john@doe.com',
        username: 'johndoe',
      },
      new UniqueEntityID('author-1'),
    );

    const jane = makeAuthor(
      {
        email: 'jane@doe.com',
        username: 'janedoe',
      },
      new UniqueEntityID('author-2'),
    );

    await inMemoryAuthorsRepository.create(john);
    await inMemoryAuthorsRepository.create(jane);

    const result = await sut.execute({
      authorId: 'author-1',
      name: 'John Doe',
      email: 'john@doe.com',
      username: 'janedoe',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UsernameAlreadyExistsError);
  });
});
