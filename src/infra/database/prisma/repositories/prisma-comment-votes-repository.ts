import { Injectable } from '@nestjs/common';

import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';
import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';

import { PrismaCommentVoteMapper } from '../mappers/prisma-comment-vote-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCommentVotesRepository implements CommentVotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CommentVote | null> {
    const vote = await this.prisma.vote.findUnique({
      where: {
        id,
      },
    });

    if (!vote) {
      return null;
    }

    return PrismaCommentVoteMapper.toDomain(vote);
  }

  async findAllForCommentByAuthorId(
    commentId: string,
    authorId: string,
  ): Promise<CommentVote[]> {
    const commentVotes = await this.prisma.vote.findMany({
      where: {
        commentId,
        authorId,
      },
    });

    return commentVotes.map(PrismaCommentVoteMapper.toDomain);
  }

  async createMany(votes: CommentVote[]): Promise<void> {
    if (votes.length === 0) {
      return;
    }

    const data = PrismaCommentVoteMapper.toPrismaCreateMany(votes);

    await this.prisma.vote.createMany(data);
  }

  async deleteMany(votes: CommentVote[]): Promise<void> {
    if (votes.length === 0) {
      return;
    }

    const voteIds = votes.map((vote) => vote.id.toString());

    await this.prisma.vote.deleteMany({
      where: {
        id: {
          in: voteIds,
        },
      },
    });
  }

  async save(vote: CommentVote): Promise<void> {
    const data = PrismaCommentVoteMapper.toPrisma(vote);

    await this.prisma.vote.update({
      where: {
        id: vote.id.toString(),
      },
      data,
    });
  }
}
