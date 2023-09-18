import { PaginationParams } from '@/core/repositories/pagination-params';
import { Post } from '@/domain/forum/enterprise/entities/post';

export abstract class PostsRepository {
  abstract findById(id: string): Promise<Post | null>;
  abstract findBySlug(slug: string): Promise<Post | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Post[]>;
  abstract findManyPopular(params: PaginationParams): Promise<Post[]>;
  abstract save(post: Post): Promise<void>;
  abstract create(post: Post): Promise<void>;
  abstract delete(post: Post): Promise<void>;
}
