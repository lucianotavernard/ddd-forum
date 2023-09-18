import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';

import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';
import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';

import { PrismaPostCommentMapper } from '../mappers/prisma-post-comment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPostCommentsRepository implements PostCommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PostComment | null> {
    const postComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!postComment) {
      return null;
    }

    return PrismaPostCommentMapper.toDomain(postComment);
  }

  async findManyByPostId(
    postId: string,
    { page, per_page }: PaginationParams,
  ): Promise<PostComment[]> {
    const postComments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: per_page,
      skip: (page - 1) * per_page,
    });

    return postComments.map(PrismaPostCommentMapper.toDomain);
  }

  async create(postComment: PostComment): Promise<void> {
    const data = PrismaPostCommentMapper.toPrisma(postComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async save(postComment: PostComment): Promise<void> {
    const data = PrismaPostCommentMapper.toPrisma(postComment);

    await this.prisma.comment.update({
      where: {
        id: postComment.id.toString(),
      },
      data,
    });
  }

  async delete(postComment: PostComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: postComment.id.toString(),
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
}
