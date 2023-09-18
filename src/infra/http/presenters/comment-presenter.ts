import { Comment } from '@/domain/forum/enterprise/entities/comment';

export class CommentPresenter {
  static toHTTP(comment: Comment<any>) {
    return {
      id: comment.id.toString(),
      points: comment.points,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
