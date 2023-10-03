import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PostWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/post-with-author';

type PrismaPostWithAuthor = PrismaPost & {
  author: PrismaUser;
};

export class PrismaPostWithAuthorMapper {
  static toDomain(raw: PrismaPostWithAuthor): PostWithAuthor {
    return PostWithAuthor.create({
      slug: raw.slug,
      title: raw.title,
      content: raw.content,
      authorId: new UniqueEntityID(raw.authorId),
      postId: new UniqueEntityID(raw.id),
      author: raw.author.name,
      points: raw.points,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
