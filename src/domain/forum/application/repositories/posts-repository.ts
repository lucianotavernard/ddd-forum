import { PaginationParams } from '@/core/repositories/pagination-params';
import { PostWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/post-with-author';
import { Post } from '@/domain/forum/enterprise/entities/post';

export abstract class PostsRepository {
  abstract findById(id: string): Promise<Post | null>;
  abstract findBySlug(slug: string): Promise<Post | null>;
  abstract findManyRecent(params: PaginationParams): Promise<PostWithAuthor[]>;
  abstract findManyPopular(params: PaginationParams): Promise<PostWithAuthor[]>;
  abstract save(post: Post): Promise<void>;
  abstract create(post: Post): Promise<void>;
  abstract delete(post: Post): Promise<void>;
}
