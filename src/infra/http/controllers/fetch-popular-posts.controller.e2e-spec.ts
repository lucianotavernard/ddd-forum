import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { PostFactory } from 'test/factories/make-post';
import { AuthorFactory } from 'test/factories/make-author';

describe('Fetch popular posts (E2E)', () => {
  let app: INestApplication;
  let authorFactory: AuthorFactory;
  let postFactory: PostFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    authorFactory = moduleRef.get(AuthorFactory);
    postFactory = moduleRef.get(PostFactory);

    await app.init();
  });

  test('[GET] /posts/popular', async () => {
    const user = await authorFactory.makePrismaAuthor();

    await Promise.all([
      postFactory.makePrismaPost({
        authorId: user.id,
        title: 'Post 01',
      }),
      postFactory.makePrismaPost({
        authorId: user.id,
        title: 'Post 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/posts/popular')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({ title: 'Post 01' }),
        expect.objectContaining({ title: 'Post 02' }),
      ]),
    });
  });
});
