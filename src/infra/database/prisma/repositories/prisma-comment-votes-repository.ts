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

  async save(vote: CommentVote): Promise<void> {
    const data = PrismaCommentVoteMapper.toPrisma(vote);

    await this.prisma.vote.update({
      where: {
        id: vote.id.toString(),
      },
      data,
    });
  }

  async create(vote: CommentVote): Promise<void> {
    const data = PrismaCommentVoteMapper.toPrisma(vote);

    await this.prisma.vote.create({
      data,
    });
  }

  async delete(vote: CommentVote): Promise<void> {
    await this.prisma.vote.delete({
      where: {
        id: vote.id.toString(),
      },
    });
  }
}
