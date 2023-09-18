import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { AuthorFactory } from 'test/factories/make-author';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let authorFactory: AuthorFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    authorFactory = moduleRef.get(AuthorFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await authorFactory.makePrismaAuthor({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
