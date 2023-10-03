import { PaginationParams } from '@/core/repositories/pagination-params';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export abstract class NotificationsRepository {
  abstract findById(id: string): Promise<Notification | null>;
  abstract findManyRecent(
    recipientId: string,
    params: PaginationParams,
  ): Promise<Notification[]>;
  abstract create(notification: Notification): Promise<void>;
  abstract save(notification: Notification): Promise<void>;
}
