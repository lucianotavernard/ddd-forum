import { PaginationParams } from '@/core/repositories/pagination-params';
import { CommentComment } from '@/domain/forum/enterprise/entities/comment-comment';

export abstract class CommentCommentsRepository {
  abstract findById(id: string): Promise<CommentComment | null>;
  abstract findManyByCommentId(
    commentId: string,
    params: PaginationParams,
  ): Promise<CommentComment[]>;
  abstract create(commentComment: CommentComment): Promise<void>;
  abstract delete(commentComment: CommentComment): Promise<void>;
  abstract deleteManyByCommentId(commentId: string): Promise<void>;
}
