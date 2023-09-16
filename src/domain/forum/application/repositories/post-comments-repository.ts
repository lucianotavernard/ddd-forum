import { PaginationParams } from '@/core/repositories/pagination-params';
import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';

export abstract class PostCommentsRepository {
  abstract findById(id: string): Promise<PostComment | null>;
  abstract findManyByPostId(
    postId: string,
    params: PaginationParams,
  ): Promise<PostComment[]>;
  abstract save(postComment: PostComment): Promise<void>;
  abstract create(postComment: PostComment): Promise<void>;
  abstract delete(postComment: PostComment): Promise<void>;
  abstract deleteManyByPostId(postId: string): Promise<void>;
}
