import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';

import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { Post } from '@/domain/forum/enterprise/entities/post';

import { PrismaPostMapper } from '../mappers/prisma-post-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return null;
    }

    return PrismaPostMapper.toDomain(post);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      return null;
    }

    return PrismaPostMapper.toDomain(post);
  }

  async findManyPopular({ page, per_page }: PaginationParams): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        points: 'desc',
      },
      take: per_page,
      skip: (page - 1) * per_page,
    });

    return posts.map(PrismaPostMapper.toDomain);
  }

  async findManyRecent({ page, per_page }: PaginationParams): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: per_page,
      skip: (page - 1) * per_page,
    });

    return posts.map(PrismaPostMapper.toDomain);
  }

  async create(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.create({
      data,
    });
  }

  async save(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.update({
      where: {
        id: post.id.toString(),
      },
      data,
    });
  }

  async delete(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.delete({
      where: {
        id: data.id,
      },
    });
  }
}