import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';

import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

import { Comment } from '@/domain/forum/enterprise/entities/comment';

import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCommentsRepository implements CommentsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentVotesRepository: CommentVotesRepository,
  ) {}

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaCommentMapper.toDomain(comment);
  }

  async findManyByPostId(
    postId: string,
    { page, per_page }: PaginationParams,
  ): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: per_page,
      skip: (page - 1) * per_page,
    });

    return comments.map(PrismaCommentMapper.toDomain);
  }

  async findManyByCommentId(
    commentId: string,
    { page, per_page }: PaginationParams,
  ): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        commentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: per_page,
      skip: (page - 1) * per_page,
    });

    return comments.map(PrismaCommentMapper.toDomain);
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);

    await Promise.all([
      this.prisma.comment.update({
        where: {
          id: comment.id.toString(),
        },
        data,
      }),
      this.commentVotesRepository.createMany(comment.votes.getNewItems()),
      this.commentVotesRepository.deleteMany(comment.votes.getRemovedItems()),
    ]);
  }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(comment: Comment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }

  async deleteManyByPostId(postId: string): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: {
        postId,
      },
    });
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: {
        commentId,
      },
    });
  }
}
