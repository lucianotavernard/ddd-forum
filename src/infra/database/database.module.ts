import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

import { PrismaPostsRepository } from './prisma/repositories/prisma-posts-repository';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

import { PrismaCommentsRepository } from './prisma/repositories/prisma-comment-repository';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

import { PrismaAuthorsRepository } from './prisma/repositories/prisma-author-repository';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
    {
      provide: CommentsRepository,
      useClass: PrismaCommentsRepository,
    },
    {
      provide: AuthorsRepository,
      useClass: PrismaAuthorsRepository,
    },
  ],
  exports: [
    PrismaService,
    PostsRepository,
    CommentsRepository,
    AuthorsRepository,
  ],
})
export class DatabaseModule {}
