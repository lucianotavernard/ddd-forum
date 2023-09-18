import { Post as PrismaPost, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Post } from '@/domain/forum/enterprise/entities/post';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export class PrismaPostMapper {
  static toDomain(raw: PrismaPost): Post {
    return Post.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        slug: Slug.create(raw.slug),
        points: raw.points ?? 0,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        publishedAt: raw.publishedAt ?? null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(post: Post): Prisma.PostUncheckedCreateInput {
    return {
      id: post.id.toString(),
      authorId: post.authorId.toString(),
      title: post.title,
      content: post.content,
      slug: post.slug.value,
      points: post.points,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
    };
  }
}
