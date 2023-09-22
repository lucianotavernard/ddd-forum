import { Injectable } from '@nestjs/common';

import { PostVotesRepository } from '@/domain/forum/application/repositories/post-votes-repository';
import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';

import { PrismaPostVoteMapper } from '../mappers/prisma-post-vote-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPostVotesRepository implements PostVotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PostVote | null> {
    const vote = await this.prisma.vote.findUnique({
      where: {
        id,
      },
    });

    if (!vote) {
      return null;
    }

    return PrismaPostVoteMapper.toDomain(vote);
  }

  async save(vote: PostVote): Promise<void> {
    const data = PrismaPostVoteMapper.toPrisma(vote);

    await this.prisma.vote.update({
      where: {
        id: vote.id.toString(),
      },
      data,
    });
  }

  async create(vote: PostVote): Promise<void> {
    const data = PrismaPostVoteMapper.toPrisma(vote);

    await this.prisma.vote.create({
      data,
    });
  }

  async delete(vote: PostVote): Promise<void> {
    await this.prisma.vote.delete({
      where: {
        id: vote.id.toString(),
      },
    });
  }
}
