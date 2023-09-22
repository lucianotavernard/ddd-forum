import { Comment as PrismaComment, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Comment } from '@/domain/forum/enterprise/entities/comment';

export class PrismaCommentMapper {
  static toDomain(raw: PrismaComment): Comment {
    return Comment.create(
      {
        content: raw.content,
        postId: new UniqueEntityID(raw.postId),
        authorId: new UniqueEntityID(raw.authorId),
        points: raw.points ?? 0,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      postId: comment.postId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      points: comment.points,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
