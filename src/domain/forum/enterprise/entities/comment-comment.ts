import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { Comment, CommentProps } from './comment';

export type CommentCommentProps = CommentProps & {
  commentId: UniqueEntityID;
};

export class CommentComment extends Comment<CommentCommentProps> {
  get commentId() {
    return this.props.commentId;
  }

  static create(
    props: Optional<CommentCommentProps, 'createdAt' | 'points'>,
    id?: UniqueEntityID,
  ) {
    const commentComment = new CommentComment(
      {
        ...props,
        points: props.points ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return commentComment;
  }
}
