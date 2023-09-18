import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Author } from '@/domain/forum/enterprise/entities/author';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { Email } from '@/domain/forum/enterprise/entities/value-objects/email';
import { InvalidEmailError } from '@/domain/forum/enterprise/entities/value-objects/errors/invalid-email-error';

import { Username } from '@/domain/forum/enterprise/entities/value-objects/username';
import { InvalidUsernameError } from '@/domain/forum/enterprise/entities/value-objects/errors/invalid-username-error';

import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { UsernameAlreadyExistsError } from './errors/username-already-exists';

type EditAuthorUseCaseRequest = {
  authorId: string;
  name: string;
  email: string;
  username: string;
};

type EditAuthorUseCaseResponse = Either<
  | EmailAlreadyExistsError
  | UsernameAlreadyExistsError
  | ResourceNotFoundError
  | InvalidEmailError
  | InvalidUsernameError,
  {
    author: Author;
  }
>;

@Injectable()
export class EditAuthorUseCase {
  constructor(private readonly authorsRepository: AuthorsRepository) {}

  async execute({
    authorId,
    name,
    email,
    username,
  }: EditAuthorUseCaseRequest): Promise<EditAuthorUseCaseResponse> {
    const emailOrError = Email.create(email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const usernameOrError = Username.create(username);

    if (usernameOrError.isLeft()) {
      return left(usernameOrError.value);
    }

    const author = await this.authorsRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    const authorWithSameEmail = await this.authorsRepository.findByEmail(email);

    if (authorWithSameEmail && authorId !== authorWithSameEmail.id.toValue()) {
      return left(new EmailAlreadyExistsError(email));
    }

    const authorWithSameUsername =
      await this.authorsRepository.findByUsername(username);

    if (
      authorWithSameUsername &&
      authorId !== authorWithSameUsername.id.toValue()
    ) {
      return left(new UsernameAlreadyExistsError(username));
    }

    author.name = name;
    author.email = emailOrError.value;
    author.username = usernameOrError.value;

    await this.authorsRepository.save(author);

    return right({
      author,
    });
  }
}
