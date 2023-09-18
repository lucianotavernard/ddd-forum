import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { PostFactory } from 'test/factories/make-post';
import { PostCommentFactory } from 'test/factories/make-post-comment';
import { AuthorFactory } from 'test/factories/make-author';

describe('Fetch post comments (E2E)', () => {
  let app: INestApplication;
  let authorFactory: AuthorFactory;
  let postFactory: PostFactory;
  let postCommentFactory: PostCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, PostFactory, PostCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    authorFactory = moduleRef.get(AuthorFactory);
    postFactory = moduleRef.get(PostFactory);
    postCommentFactory = moduleRef.get(PostCommentFactory);

    await app.init();
  });

  test('[GET] /posts/:postId/comments', async () => {
    const user = await authorFactory.makePrismaAuthor();

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    });

    await Promise.all([
      postCommentFactory.makePrismaPostComment({
        authorId: user.id,
        postId: post.id,
        content: 'Comment 01',
      }),
      postCommentFactory.makePrismaPostComment({
        authorId: user.id,
        postId: post.id,
        content: 'Comment 02',
      }),
    ]);

    const postId = post.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}/comments`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 01' }),
        expect.objectContaining({ content: 'Comment 01' }),
      ]),
    });
  });
});
