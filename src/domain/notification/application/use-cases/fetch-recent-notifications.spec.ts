import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchRecentNotificationsUseCase } from './fetch-recent-notifications';

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { makeNotification } from 'test/factories/make-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: FetchRecentNotificationsUseCase;

describe('Fetch Recent Posts', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new FetchRecentNotificationsUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to fetch recent posts', async () => {
    await inMemoryNotificationsRepository.create(
      makeNotification({
        recipientId: new UniqueEntityID('recipient-1'),
        createdAt: new Date(2022, 0, 20),
      }),
    );
    await inMemoryNotificationsRepository.create(
      makeNotification({
        recipientId: new UniqueEntityID('recipient-1'),
        createdAt: new Date(2022, 0, 18),
      }),
    );
    await inMemoryNotificationsRepository.create(
      makeNotification({
        recipientId: new UniqueEntityID('recipient-1'),
        createdAt: new Date(2022, 0, 23),
      }),
    );

    const result = await sut.execute({
      page: 1,
      per_page: 20,
      recipientId: 'recipient-1',
    });

    expect(result.value?.notifications).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent posts', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryNotificationsRepository.create(
        makeNotification({
          recipientId: new UniqueEntityID('recipient-1'),
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      per_page: 20,
      recipientId: 'recipient-1',
    });

    expect(result.value?.notifications).toHaveLength(2);
  });
});
