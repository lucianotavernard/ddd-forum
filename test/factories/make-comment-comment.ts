import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  CommentComment,
  CommentCommentProps,
} from '@/domain/forum/enterprise/entities/comment-comment';

export function makeCommentComment(
  override: Partial<CommentCommentProps> = {},
  id?: UniqueEntityID,
) {
  const commentComment = CommentComment.create(
    {
      authorId: new UniqueEntityID(),
      commentId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return commentComment;
}
