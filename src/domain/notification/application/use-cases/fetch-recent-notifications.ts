import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

type FetchRecentNotificationsUseCaseRequest = {
  page: number;
  per_page?: number;
  recipientId: string;
};

type FetchRecentNotificationsUseCaseResponse = Either<
  null,
  {
    notifications: Notification[];
  }
>;

@Injectable()
export class FetchRecentNotificationsUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    page,
    per_page = 10,
    recipientId,
  }: FetchRecentNotificationsUseCaseRequest): Promise<FetchRecentNotificationsUseCaseResponse> {
    const notifications = await this.notificationsRepository.findManyRecent(
      recipientId,
      {
        page,
        per_page,
      },
    );

    return right({
      notifications,
    });
  }
}
