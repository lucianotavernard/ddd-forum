import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';

import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { Post } from '@/domain/forum/enterprise/entities/post';

export class InMemoryPostsRepository implements PostsRepository {
  public items: Post[] = [];

  async exists(id: string) {
    const post = this.items.find((item) => item.id.toString() === id);

    return !!post;
  }

  async findById(id: string) {
    const post = this.items.find((item) => item.id.toString() === id);

    if (!post) {
      return null;
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = this.items.find((item) => item.slug.value === slug);

    if (!post) {
      return null;
    }

    return post;
  }

  async findManyRecent({ page, per_page }: PaginationParams) {
    const posts = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * per_page, page * per_page);

    return posts;
  }

  async findManyPopular({ page, per_page }: PaginationParams) {
    const posts = this.items
      .sort((a, b) => b.points - a.points)
      .slice((page - 1) * per_page, page * per_page);

    return posts;
  }

  async create(post: Post) {
    this.items.push(post);

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async save(post: Post) {
    const itemIndex = this.items.findIndex((item) => item.id === post.id);

    this.items[itemIndex] = post;

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async delete(post: Post) {
    const itemIndex = this.items.findIndex((item) => item.id === post.id);

    this.items.splice(itemIndex, 1);
  }
}
