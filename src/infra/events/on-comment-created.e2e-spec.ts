import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DomainEvents } from '@/core/events/domain-events';

import { AuthorFactory } from 'test/factories/make-author';
import { PostFactory } from 'test/factories/make-post';
import { waitFor } from 'test/utils/wait-for';

describe('On comment created (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let postFactory: PostFactory;
  let authorFactory: AuthorFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    postFactory = moduleRef.get(PostFactory);
    authorFactory = moduleRef.get(AuthorFactory);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it('should send a notification when comment is created', async () => {
    const user = await authorFactory.makePrismaAuthor();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    const post = await postFactory.makePrismaPost({
      authorId: user.id,
    });

    const postId = post.id.toString();

    await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New comment',
      });

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
