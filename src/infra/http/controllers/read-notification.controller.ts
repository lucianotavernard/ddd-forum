import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readonly readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const recipientId = user.sub;

    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
