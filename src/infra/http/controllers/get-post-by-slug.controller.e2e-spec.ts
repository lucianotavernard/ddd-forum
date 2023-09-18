import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { PostFactory } from 'test/factories/make-post';
import { AuthorFactory } from 'test/factories/make-author';

describe('Get post by slug (E2E)', () => {
  let app: INestApplication;
  let authorFactory: AuthorFactory;
  let postFactory: PostFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    authorFactory = moduleRef.get(AuthorFactory);
    postFactory = moduleRef.get(PostFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /posts/:slug', async () => {
    const user = await authorFactory.makePrismaAuthor();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    await postFactory.makePrismaPost({
      authorId: user.id,
      title: 'Post 01',
      slug: Slug.create('post-01'),
    });

    const response = await request(app.getHttpServer())
      .get('/posts/post-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      post: expect.objectContaining({ title: 'Post 01' }),
    });
  });
});
