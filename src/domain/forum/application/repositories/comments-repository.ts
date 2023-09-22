import { PaginationParams } from '@/core/repositories/pagination-params';
import { Comment } from '@/domain/forum/enterprise/entities/comment';

export abstract class CommentsRepository {
  abstract findById(id: string): Promise<Comment | null>;
  abstract findManyByPostId(
    postId: string,
    params: PaginationParams,
  ): Promise<Comment[]>;
  abstract findManyByCommentId(
    commentId: string,
    params: PaginationParams,
  ): Promise<Comment[]>;
  abstract save(comment: Comment): Promise<void>;
  abstract create(comment: Comment): Promise<void>;
  abstract delete(comment: Comment): Promise<void>;
  abstract deleteManyByPostId(postId: string): Promise<void>;
  abstract deleteManyByCommentId(commentId: string): Promise<void>;
}
