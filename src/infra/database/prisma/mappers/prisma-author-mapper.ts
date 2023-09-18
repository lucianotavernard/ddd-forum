import { User as PrismaUser, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Author } from '@/domain/forum/enterprise/entities/author';
import { Email } from '@/domain/forum/enterprise/entities/value-objects/email';
import { Username } from '@/domain/forum/enterprise/entities/value-objects/username';

export class PrismaAuthorMapper {
  static toDomain(raw: PrismaUser): Author {
    const emailOrError = Email.create(raw.email);
    const usernameOrError = Username.create(raw.username);

    if (emailOrError.isLeft()) {
      throw new Error('Invalid email type.');
    }

    if (usernameOrError.isLeft()) {
      throw new Error('Invalid username type.');
    }

    return Author.create(
      {
        name: raw.name,
        email: emailOrError.value,
        username: usernameOrError.value,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(author: Author): Prisma.UserUncheckedCreateInput {
    return {
      id: author.id.toString(),
      name: author.name,
      email: author.email.value,
      username: author.username.value,
      password: author.password,
    };
  }
}
