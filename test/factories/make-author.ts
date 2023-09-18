import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Author } from '@/domain/forum/enterprise/entities/author';

import { Email } from '@/domain/forum/enterprise/entities/value-objects/email';
import { Username } from '@/domain/forum/enterprise/entities/value-objects/username';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAuthorMapper } from '@/infra/database/prisma/mappers/prisma-author-mapper';

type AuthorProps = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export function makeAuthor(
  override: Partial<AuthorProps> = {},
  id?: UniqueEntityID,
) {
  const emailOrError = Email.create(override?.email ?? 'john@doe.com');
  const usernameOrError = Username.create(override?.username ?? 'johndoe');

  const email = emailOrError.value as Email;
  const username = usernameOrError.value as Username;

  const author = Author.create(
    {
      name: override.name ?? faker.person.fullName(),
      email: email,
      username: username,
      password: override.password ?? '123456',
    },
    id,
  );

  return author;
}

@Injectable()
export class AuthorFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAuthor(data: Partial<AuthorProps> = {}): Promise<Author> {
    const author = makeAuthor(data);

    await this.prisma.user.create({
      data: PrismaAuthorMapper.toPrisma(author),
    });

    return author;
  }
}
