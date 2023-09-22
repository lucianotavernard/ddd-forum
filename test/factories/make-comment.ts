import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaCommentMapper } from '@/infra/database/prisma/mappers/prisma-comment-mapper';

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.create(
    {
      authorId: new UniqueEntityID(),
      postId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return comment;
}

@Injectable()
export class CommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaComment(data: Partial<CommentProps> = {}): Promise<Comment> {
    const comment = makeComment(data);

    await this.prisma.comment.create({
      data: PrismaCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}
