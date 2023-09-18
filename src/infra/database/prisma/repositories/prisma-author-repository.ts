import { Injectable } from '@nestjs/common';

import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';
import { Author } from '@/domain/forum/enterprise/entities/author';

import { PrismaService } from '../prisma.service';
import { PrismaAuthorMapper } from '../mappers/prisma-author-mapper';

@Injectable()
export class PrismaAuthorsRepository implements AuthorsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<Author | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaAuthorMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<Author | null> {
    const author = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!author) {
      return null;
    }

    return PrismaAuthorMapper.toDomain(author);
  }

  async findByUsername(username: string): Promise<Author> {
    const author = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!author) {
      return null;
    }

    return PrismaAuthorMapper.toDomain(author);
  }

  async create(author: Author): Promise<void> {
    const data = PrismaAuthorMapper.toPrisma(author);

    await this.prisma.user.create({
      data,
    });
  }

  async save(author: Author): Promise<void> {
    const data = PrismaAuthorMapper.toPrisma(author);

    await this.prisma.user.update({
      where: {
        id: author.id.toString(),
      },
      data,
    });
  }
}
