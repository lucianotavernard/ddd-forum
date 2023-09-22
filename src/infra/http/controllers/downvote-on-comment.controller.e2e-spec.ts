import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { CommentFactory } from 'test/factories/make-comment';
import { AuthorFactory } from 'test/factories/make-author';
import { PostFactory } from 'test/factories/make-post';

describe('Downvote on comment (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authorFactory: AuthorFactory;
  let commentFactory: CommentFactory;
  let postFactory: PostFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, CommentFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    authorFactory = moduleRef.get(AuthorFactory);
    commentFactory = moduleRef.get(CommentFactory);
    postFactory = moduleRef.get(PostFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[COMMENT] /comments/:commentId/downvote', async () => {
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
      .post(`/comments/${commentId}/downvote`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(201);

    const downvoteOnDatabase = await prisma.vote.findFirst({
      where: {
        type: 'DOWNVOTE',
      },
    });

    expect(downvoteOnDatabase).toBeTruthy();
  });
});
