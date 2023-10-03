import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { OnCommentCreated } from '@/domain/notification/application/subscribers/on-comment-created';

import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

@Module({
  imports: [DatabaseModule],
  providers: [OnCommentCreated, SendNotificationUseCase],
})
export class EventsModule {}
