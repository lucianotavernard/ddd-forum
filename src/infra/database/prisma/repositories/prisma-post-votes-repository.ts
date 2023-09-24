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

  async findAllForPostByAuthorId(
    postId: string,
    authorId: string,
  ): Promise<PostVote[]> {
    const postVotess = await this.prisma.vote.findMany({
      where: {
        postId,
        authorId,
      },
    });

    return postVotess.map(PrismaPostVoteMapper.toDomain);
  }

  async createMany(votes: PostVote[]): Promise<void> {
    if (votes.length === 0) {
      return;
    }

    const data = PrismaPostVoteMapper.toPrismaCreateMany(votes);

    await this.prisma.vote.createMany(data);
  }

  async deleteMany(votes: PostVote[]): Promise<void> {
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

  async save(vote: PostVote): Promise<void> {
    const data = PrismaPostVoteMapper.toPrisma(vote);

    await this.prisma.vote.update({
      where: {
        id: vote.id.toString(),
      },
      data,
    });
  }
}
