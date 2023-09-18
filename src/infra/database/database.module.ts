import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

import { PrismaPostsRepository } from './prisma/repositories/prisma-posts-repository';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

import { PrismaPostCommentsRepository } from './prisma/repositories/prisma-post-comments-repository';
import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';

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
      provide: PostCommentsRepository,
      useClass: PrismaPostCommentsRepository,
    },
    {
      provide: AuthorsRepository,
      useClass: PrismaAuthorsRepository,
    },
  ],
  exports: [
    PrismaService,
    PostsRepository,
    PostCommentsRepository,
    AuthorsRepository,
  ],
})
export class DatabaseModule {}
