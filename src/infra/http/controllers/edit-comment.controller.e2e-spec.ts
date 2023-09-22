import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { PostFactory } from 'test/factories/make-post';
import { CommentFactory } from 'test/factories/make-comment';
import { AuthorFactory } from 'test/factories/make-author';

describe('Edit comment on post (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authorFactory: AuthorFactory;
  let commentFactory: CommentFactory;
  let postFactory: PostFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, PostFactory, CommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    authorFactory = moduleRef.get(AuthorFactory);
    commentFactory = moduleRef.get(CommentFactory);
    postFactory = moduleRef.get(PostFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /posts/:id/commens/:commentId', async () => {
    const user = await authorFactory.makePrismaAuthor();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    });

    const comment = await commentFactory.makePrismaComment({
      authorId: user.id,
      postId: post.id,
    });

    const commentId = comment.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New content',
      });

    expect(response.statusCode).toBe(204);

    const postOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New content',
      },
    });

    expect(postOnDatabase).toBeTruthy();
  });
});
