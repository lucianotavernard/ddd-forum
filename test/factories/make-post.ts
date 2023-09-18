import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Post, PostProps } from '@/domain/forum/enterprise/entities/post';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPostMapper } from '@/infra/database/prisma/mappers/prisma-post-mapper';

export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityID,
) {
  const post = Post.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      points: faker.number.int({ min: 1, max: 100 }),
      ...override,
    },
    id,
  );

  return post;
}

@Injectable()
export class PostFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaPost(data: Partial<PostProps> = {}): Promise<Post> {
    const post = makePost(data);

    await this.prisma.post.create({
      data: PrismaPostMapper.toPrisma(post),
    });

    return post;
  }
}
