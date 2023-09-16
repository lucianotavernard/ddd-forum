import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  PostComment,
  PostCommentProps,
} from '@/domain/forum/enterprise/entities/post-comment';

export function makePostComment(
  override: Partial<PostCommentProps> = {},
  id?: UniqueEntityID,
) {
  const postComment = PostComment.create(
    {
      authorId: new UniqueEntityID(),
      postId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return postComment;
}
