import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';
import { HashComparer } from '@/domain/forum/application/providers/hash-comparer';
import { Encrypter } from '@/domain/forum/application/providers/encrypter';

import { WrongCredentialsError } from './errors/wrong-credentials-error';

type AuthenticateAuthorUseCaseRequest = {
  email: string;
  password: string;
};

type AuthenticateAuthorUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateAuthorUseCase {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAuthorUseCaseRequest): Promise<AuthenticateAuthorUseCaseResponse> {
    const author = await this.authorsRepository.findByEmail(email);

    if (!author) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      author.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: author.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
