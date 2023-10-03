import { PaginationParams } from '@/core/repositories/pagination-params';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async findManyRecent(
    recipientId: string,
    { page, per_page }: PaginationParams,
  ): Promise<Notification[]> {
    const notifications = this.items
      .filter((item) => item.recipientId.toString() === recipientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * per_page, page * per_page);

    return notifications;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[itemIndex] = notification;
  }
}
