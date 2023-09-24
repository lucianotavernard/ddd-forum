import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { PostFactory } from 'test/factories/make-post';
import { AuthorFactory } from 'test/factories/make-author';

describe('Upvote on post (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authorFactory: AuthorFactory;
  let postFactory: PostFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    authorFactory = moduleRef.get(AuthorFactory);
    postFactory = moduleRef.get(PostFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /posts/:postId/upvote', async () => {
    const user = await authorFactory.makePrismaAuthor();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    });

    const postId = post.id.toString();

    console.log(postId);

    const response = await request(app.getHttpServer())
      .post(`/posts/${postId}/upvote`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(201);

    const upvoteOnDatabase = await prisma.vote.findFirst({
      where: {
        postId: postId,
      },
    });

    console.log(upvoteOnDatabase);

    expect(upvoteOnDatabase).toBeTruthy();
  });
});
