import { Vote as PrismaPostVote, Prisma } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  PostVote,
  PostVoteType,
} from '@/domain/forum/enterprise/entities/post-vote';

export class PrismaPostVoteMapper {
  static toDomain(raw: PrismaPostVote): PostVote {
    return PostVote.create(
      {
        postId: new UniqueEntityID(raw.postId),
        authorId: new UniqueEntityID(raw.authorId),
        type: raw.type as PostVoteType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(vote: PostVote): Prisma.VoteUncheckedCreateInput {
    return {
      id: vote.id.toString(),
      postId: vote.postId.toString(),
      authorId: vote.authorId.toString(),
      type: vote.type,
      createdAt: vote.createdAt,
      updatedAt: vote.updatedAt,
    };
  }

  static toPrismaUpdateMany(votes: PostVote[]): Prisma.VoteUpdateManyArgs {
    const voteIds = votes.map((vote) => vote.id.toString());

    return {
      where: {
        id: {
          in: voteIds,
        },
      },
      data: {
        postId: votes[0].postId.toString(),
      },
    };
  }
}
