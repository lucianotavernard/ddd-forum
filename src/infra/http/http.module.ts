import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ProviderModule } from '../provider/provider.module';

import { PostService } from '@/domain/forum/application/services/post-service';
import { CommentService } from '@/domain/forum/application/services/comment-service';

import { AuthenticateAuthorUseCase } from '@/domain/forum/application/use-cases/authenticate-author';
import { CommentOnPostUseCase } from '@/domain/forum/application/use-cases/comment-on-post';
import { CreatePostUseCase } from '@/domain/forum/application/use-cases/create-post';
import { DeleteCommentUseCase } from '@/domain/forum/application/use-cases/delete-comment';
import { DeletePostUseCase } from '@/domain/forum/application/use-cases/delete-post';
import { DownvoteOnCommentUseCase } from '@/domain/forum/application/use-cases/downvote-on-comment';
import { DownvoteOnPostUseCase } from '@/domain/forum/application/use-cases/downvote-on-post';
import { EditCommentUseCase } from '@/domain/forum/application/use-cases/edit-comment';
import { EditPostUseCase } from '@/domain/forum/application/use-cases/edit-post';
import { FetchPopularPostsUseCase } from '@/domain/forum/application/use-cases/fetch-popular-posts';
import { FetchCommentsFromPostUseCase } from '@/domain/forum/application/use-cases/fetch-post-comments-from-post';
import { FetchRecentPostsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-posts';
import { GetPostBySlugUseCase } from '@/domain/forum/application/use-cases/get-post-by-slug';
import { RegisterAuthorUseCase } from '@/domain/forum/application/use-cases/register-author';
import { UpvoteOnCommentUseCase } from '@/domain/forum/application/use-cases/upvote-on-comment';
import { UpvoteOnPostUseCase } from '@/domain/forum/application/use-cases/upvote-on-post';

import { AuthenticateController } from './controllers/authentication.controller';
import { CommentOnPostController } from './controllers/comment-on-post.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreatePostController } from './controllers/create-post.controller';
import { DeletePostCommentController } from './controllers/delete-comment.controller';
import { DeletePostController } from './controllers/delete-post.controller';
import { DownvoteOnCommentController } from './controllers/downvote-on-comment.controller';
import { DownvoteOnPostController } from './controllers/downvote-on-post.controller';
import { EditCommentOnPostController } from './controllers/edit-comment.controller';
import { EditPostController } from './controllers/edit-post.controller';
import { FetchPostCommentsController } from './controllers/fetch-comments-from-post.controller';
import { FetchPopularPostsController } from './controllers/fetch-popular-posts.controller';
import { FetchRecentPostsController } from './controllers/fetch-recent-posts.controller';
import { GetPostBySlugController } from './controllers/get-post-by-slug.controller';
import { UpvoteOnCommentController } from './controllers/upvote-on-comment.controller';
import { UpvoteOnPostController } from './controllers/upvote-on-post.controller';

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
    UpvoteOnPostController,
    UpvoteOnCommentController,
    DownvoteOnPostController,
    DownvoteOnCommentController,
    GetPostBySlugController,
  ],
  providers: [
    PostService,
    CommentService,
    AuthenticateAuthorUseCase,
    CommentOnPostUseCase,
    CreatePostUseCase,
    DeleteCommentUseCase,
    DeletePostUseCase,
    EditPostUseCase,
    EditCommentUseCase,
    FetchCommentsFromPostUseCase,
    FetchPopularPostsUseCase,
    FetchRecentPostsUseCase,
    GetPostBySlugUseCase,
    RegisterAuthorUseCase,
    UpvoteOnPostUseCase,
    UpvoteOnCommentUseCase,
    DownvoteOnPostUseCase,
    DownvoteOnCommentUseCase,
  ],
})
export class HttpModule {}
