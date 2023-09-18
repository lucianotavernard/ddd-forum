import { Comment as PrismaComment, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';

export class PrismaPostCommentMapper {
  static toDomain(raw: PrismaComment): PostComment {
    return PostComment.create(
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

  static toPrisma(
    postComment: PostComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: postComment.id.toString(),
      postId: postComment.postId.toString(),
      authorId: postComment.authorId.toString(),
      content: postComment.content,
      points: postComment.points,
      createdAt: postComment.createdAt,
      updatedAt: postComment.updatedAt,
    };
  }
}
