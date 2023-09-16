import { PaginationParams } from '@/core/repositories/pagination-params';

import { CommentCommentsRepository } from '@/domain/forum/application/repositories/comment-comments-repository';
import { CommentComment } from '@/domain/forum/enterprise/entities/comment-comment';

export class InMemoryCommentCommentsRepository
  implements CommentCommentsRepository
{
  public items: CommentComment[] = [];

  async findById(id: string) {
    const commentcomment = this.items.find((item) => item.id.toString() === id);

    if (!commentcomment) {
      return null;
    }

    return commentcomment;
  }

  async findManyByCommentId(
    commentId: string,
    { page, per_page }: PaginationParams,
  ) {
    const commentcomments = this.items
      .filter((item) => item.commentId.toString() === commentId)
      .slice((page - 1) * per_page, page * per_page);

    return commentcomments;
  }

  async create(commentcomment: CommentComment) {
    this.items.push(commentcomment);
  }

  async delete(commentcomment: CommentComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === commentcomment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async deleteManyByCommentId(commentId: string) {
    const commentcomments = this.items.filter(
      (item) => item.commentId.toString() !== commentId,
    );

    this.items = commentcomments;
  }
}
