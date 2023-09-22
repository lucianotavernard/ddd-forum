import { Vote as PrismaCommentVote, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  CommentVote,
  CommentVoteType,
} from '@/domain/forum/enterprise/entities/comment-vote';

export class PrismaCommentVoteMapper {
  static toDomain(raw: PrismaCommentVote): CommentVote {
    return CommentVote.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        commentId: new UniqueEntityID(raw.postId),
        type: raw.type as CommentVoteType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(vote: CommentVote): Prisma.VoteUncheckedCreateInput {
    return {
      id: vote.id.toString(),
      authorId: vote.authorId.toString(),
      commentId: vote.commentId.toString(),
      type: vote.type,
      createdAt: vote.createdAt,
      updatedAt: vote.updatedAt,
    };
  }
}
