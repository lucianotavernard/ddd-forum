import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';

import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';
import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';

export class InMemoryPostCommentsRepository implements PostCommentsRepository {
  public items: PostComment[] = [];

  async findById(id: string) {
    const postcomment = this.items.find((item) => item.id.toString() === id);

    if (!postcomment) {
      return null;
    }

    return postcomment;
  }

  async findManyByPostId(postId: string, { page, per_page }: PaginationParams) {
    const postcomments = this.items
      .filter((item) => item.postId.toString() === postId)
      .slice((page - 1) * per_page, page * per_page);

    return postcomments;
  }

  async create(postComment: PostComment) {
    this.items.push(postComment);

    DomainEvents.dispatchEventsForAggregate(postComment.id);
  }

  async delete(postComment: PostComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === postComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async save(postComment: PostComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === postComment.id,
    );

    this.items[itemIndex] = postComment;

    DomainEvents.dispatchEventsForAggregate(postComment.id);
  }

  async deleteManyByPostId(postId: string) {
    const postcomments = this.items.filter(
      (item) => item.postId.toString() !== postId,
    );

    this.items = postcomments;
  }
}
