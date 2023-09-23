import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';

import { Comment } from '@/domain/forum/enterprise/entities/comment';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';
import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';

export class InMemoryCommentsRepository implements CommentsRepository {
  public items: Comment[] = [];

  constructor(
    private readonly commentVotesRepository: CommentVotesRepository,
  ) {}

  async findById(id: string) {
    const comment = this.items.find((item) => item.id.toString() === id);

    if (!comment) {
      return null;
    }

    return comment;
  }

  async findManyByPostId(postId: string, { page, per_page }: PaginationParams) {
    const comments = this.items
      .filter((item) => item.postId.toString() === postId)
      .slice((page - 1) * per_page, page * per_page);

    return comments;
  }

  async findManyByCommentId(
    commentId: string,
    { page, per_page }: PaginationParams,
  ) {
    const comments = this.items
      .filter((item) => item.commentId.toString() === commentId)
      .slice((page - 1) * per_page, page * per_page);

    return comments;
  }

  async save(comment: Comment) {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id);

    this.items[itemIndex] = comment;

    await this.commentVotesRepository.createMany(comment.votes.getNewItems());
    await this.commentVotesRepository.deleteMany(
      comment.votes.getRemovedItems(),
    );
  }

  async create(comment: Comment) {
    this.items.push(comment);

    await this.commentVotesRepository.createMany(comment.votes.getNewItems());

    DomainEvents.dispatchEventsForAggregate(comment.id);
  }

  async delete(comment: Comment) {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id);

    this.items.splice(itemIndex, 1);
  }

  async deleteManyByPostId(postId: string) {
    const comments = this.items.filter(
      (item) => item.postId.toString() !== postId,
    );

    this.items = comments;
  }

  async deleteManyByCommentId(commentId: string) {
    const comments = this.items.filter(
      (item) => item.commentId.toString() !== commentId,
    );

    this.items = comments;
  }
}
