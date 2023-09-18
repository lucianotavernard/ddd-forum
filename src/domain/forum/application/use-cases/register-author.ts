import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { Author } from '@/domain/forum/enterprise/entities/author';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';

import { Email } from '@/domain/forum/enterprise/entities/value-objects/email';
import { InvalidEmailError } from '@/domain/forum/enterprise/entities/value-objects/errors/invalid-email-error';

import { Username } from '@/domain/forum/enterprise/entities/value-objects/username';
import { InvalidUsernameError } from '@/domain/forum/enterprise/entities/value-objects/errors/invalid-username-error';

import { HashGenerator } from '@/domain/forum/application/providers/hash-generator';

import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { UsernameAlreadyExistsError } from './errors/username-already-exists';

type RegisterAuthorUseCaseRequest = {
  name: string;
  email: string;
  username: string;
  password: string;
};

type RegisterAuthorUseCaseResponse = Either<
  | EmailAlreadyExistsError
  | UsernameAlreadyExistsError
  | InvalidEmailError
  | InvalidUsernameError,
  {
    author: Author;
  }
>;

@Injectable()
export class RegisterAuthorUseCase {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    username,
    password,
  }: RegisterAuthorUseCaseRequest): Promise<RegisterAuthorUseCaseResponse> {
    const emailOrError = Email.create(email);
    const usernameOrError = Username.create(username);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (usernameOrError.isLeft()) {
      return left(usernameOrError.value);
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const author = Author.create({
      name,
      email: emailOrError.value,
      username: usernameOrError.value,
      password: hashedPassword,
    });

    const authorWithSameEmail = await this.authorsRepository.findByEmail(
      author.email.value,
    );

    if (authorWithSameEmail) {
      return left(new EmailAlreadyExistsError(email));
    }

    const authorWithSameUsername = await this.authorsRepository.findByUsername(
      author.username.value,
    );

    if (authorWithSameUsername) {
      return left(new UsernameAlreadyExistsError(username));
    }

    await this.authorsRepository.create(author);

    return right({
      author,
    });
  }
}
