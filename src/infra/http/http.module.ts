import { Module } from '@nestjs/common';

import { ProviderModule } from '../provider/provider.module';
import { DatabaseModule } from '../database/database.module';

import { AuthenticateAuthorUseCase } from '@/domain/forum/application/use-cases/authenticate-author';
import { CommentOnPostUseCase } from '@/domain/forum/application/use-cases/comment-on-post';
import { CreatePostUseCase } from '@/domain/forum/application/use-cases/create-post';
import { DeletePostUseCase } from '@/domain/forum/application/use-cases/delete-post';
import { DeletePostCommentUseCase } from '@/domain/forum/application/use-cases/delete-post-comment';
import { EditCommentOnPostUseCase } from '@/domain/forum/application/use-cases/edit-comment-on-post';
import { EditPostUseCase } from '@/domain/forum/application/use-cases/edit-post';
import { FetchPopularPostsUseCase } from '@/domain/forum/application/use-cases/fetch-popular-posts';
import { FetchPostCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-post-comments';
import { FetchRecentPostsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-posts';
import { GetPostBySlugUseCase } from '@/domain/forum/application/use-cases/get-post-by-slug';
import { RegisterAuthorUseCase } from '@/domain/forum/application/use-cases/register-author';

import { AuthenticateController } from './controllers/authentication.controller';
import { CommentOnPostController } from './controllers/comment-on-post.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreatePostController } from './controllers/create-post.controller';
import { DeletePostCommentController } from './controllers/delete-post-comment.controller';
import { DeletePostController } from './controllers/delete-post.controller';
import { EditCommentOnPostController } from './controllers/edit-comment-on-post.controller';
import { EditPostController } from './controllers/edit-post.controller';
import { FetchPopularPostsController } from './controllers/fetch-popular-posts.controller';
import { FetchPostCommentsController } from './controllers/fetch-post-comments.controller';
import { FetchRecentPostsController } from './controllers/fetch-recent-posts.controller';
import { GetPostBySlugController } from './controllers/get-post-by-slug.controller';

@Module({
  imports: [DatabaseModule, ProviderModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CommentOnPostController,
    EditCommentOnPostController,
    FetchPostCommentsController,
    FetchPopularPostsController,
    FetchRecentPostsController,
    CreatePostController,
    EditPostController,
    DeletePostController,
    DeletePostCommentController,
    GetPostBySlugController,
  ],
  providers: [
    AuthenticateAuthorUseCase,
    CommentOnPostUseCase,
    CreatePostUseCase,
    DeletePostCommentUseCase,
    DeletePostUseCase,
    EditPostUseCase,
    EditCommentOnPostUseCase,
    FetchPostCommentsUseCase,
    FetchPopularPostsUseCase,
    FetchRecentPostsUseCase,
    GetPostBySlugUseCase,
    RegisterAuthorUseCase,
  ],
})
export class HttpModule {}
