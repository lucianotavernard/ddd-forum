import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Post, PostProps } from '@/domain/forum/enterprise/entities/post';

export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityID,
) {
  const post = Post.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      points: faker.number.int({ min: 1, max: 100 }),
      ...override,
    },
    id,
  );

  return post;
}
