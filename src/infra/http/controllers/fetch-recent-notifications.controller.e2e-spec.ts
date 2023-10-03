import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { NotificationFactory } from 'test/factories/make-notification';
import { AuthorFactory } from 'test/factories/make-author';

describe('Fetch recent notifications (E2E)', () => {
  let app: INestApplication;
  let authorFactory: AuthorFactory;
  let notificationFactory: NotificationFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AuthorFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    authorFactory = moduleRef.get(AuthorFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /notifications', async () => {
    const user = await authorFactory.makePrismaAuthor();

    const accessToken = jwt.sign({
      sub: user.id.toString(),
    });

    await Promise.all([
      notificationFactory.makePrismaNotification({
        recipientId: user.id,
        title: 'Notification 01',
      }),
      notificationFactory.makePrismaNotification({
        recipientId: user.id,
        title: 'Notification 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      notifications: expect.arrayContaining([
        expect.objectContaining({ title: 'Notification 01' }),
        expect.objectContaining({ title: 'Notification 02' }),
      ]),
    });
  });
});
