import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { Comment, CommentProps } from './comment';

export type PostCommentProps = CommentProps & {
  postId: UniqueEntityID;
};

export class PostComment extends Comment<PostCommentProps> {
  get postId() {
    return this.props.postId;
  }

  static create(
    props: Optional<PostCommentProps, 'createdAt' | 'points'>,
    id?: UniqueEntityID,
  ) {
    const postComment = new PostComment(
      {
        ...props,
        points: props.points ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return postComment;
  }
}
