import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

import { PrismaPostsRepository } from './prisma/repositories/prisma-posts-repository';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

import { PrismaPostVotesRepository } from './prisma/repositories/prisma-post-votes-repository';
import { PostVotesRepository } from '@/domain/forum/application/repositories/post-votes-repository';

import { PrismaCommentsRepository } from './prisma/repositories/prisma-comments-repository';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

import { PrismaCommentVotesRepository } from './prisma/repositories/prisma-comment-votes-repository';
import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';

import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';

import { PrismaAuthorsRepository } from './prisma/repositories/prisma-authors-repository';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
    {
      provide: PostVotesRepository,
      useClass: PrismaPostVotesRepository,
    },
    {
      provide: CommentsRepository,
      useClass: PrismaCommentsRepository,
    },
    {
      provide: CommentVotesRepository,
      useClass: PrismaCommentVotesRepository,
    },
    {
      provide: AuthorsRepository,
      useClass: PrismaAuthorsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    PostsRepository,
    CommentsRepository,
    PostVotesRepository,
    CommentVotesRepository,
    NotificationsRepository,
    AuthorsRepository,
  ],
})
export class DatabaseModule {}
