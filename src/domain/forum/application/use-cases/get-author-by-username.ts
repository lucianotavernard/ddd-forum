import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { Author } from '@/domain/forum/enterprise/entities/author';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';

type GetAuthorByUsernameUseCaseRequest = {
  username: string;
};

type GetAuthorByUsernameUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    author: Author;
  }
>;

@Injectable()
export class GetAuthorByUsernameUseCase {
  constructor(private readonly authorsRepository: AuthorsRepository) {}

  async execute({
    username,
  }: GetAuthorByUsernameUseCaseRequest): Promise<GetAuthorByUsernameUseCaseResponse> {
    const author = await this.authorsRepository.findByUsername(username);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    return right({
      author,
    });
  }
}
