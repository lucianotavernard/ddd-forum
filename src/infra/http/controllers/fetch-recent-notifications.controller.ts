import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { FetchRecentNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-recent-notifications';
import { NotificationPresenter } from '../presenters/notification-presenter';

const pageQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  per_page: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(20)),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/notifications')
export class FetchRecentNotificationsController {
  constructor(
    private readonly fetchRecentNotifications: FetchRecentNotificationsUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) { page, per_page }: PageQueryParamSchema,
  ) {
    const result = await this.fetchRecentNotifications.execute({
      page,
      per_page,
      recipientId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const notifications = result.value.notifications;

    return {
      notifications: notifications.map(NotificationPresenter.toHTTP),
    };
  }
}
