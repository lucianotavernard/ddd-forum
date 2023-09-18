import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  PostComment,
  PostCommentProps,
} from '@/domain/forum/enterprise/entities/post-comment';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPostCommentMapper } from '@/infra/database/prisma/mappers/prisma-post-comment-mapper';

export function makePostComment(
  override: Partial<PostCommentProps> = {},
  id?: UniqueEntityID,
) {
  const postComment = PostComment.create(
    {
      authorId: new UniqueEntityID(),
      postId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return postComment;
}

@Injectable()
export class PostCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaPostComment(
    data: Partial<PostCommentProps> = {},
  ): Promise<PostComment> {
    const comment = makePostComment(data);

    await this.prisma.comment.create({
      data: PrismaPostCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}
