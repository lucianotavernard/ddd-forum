import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';
import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';

export class InMemoryCommentVotesRepository implements CommentVotesRepository {
  public items: CommentVote[] = [];

  async findById(id: string) {
    const vote = this.items.find((item) => item.id.toString() === id);

    if (!vote) {
      return null;
    }

    return vote;
  }

  async create(vote: CommentVote) {
    this.items.push(vote);
  }

  async save(vote: CommentVote) {
    const itemIndex = this.items.findIndex((item) => item.id === vote.id);

    this.items[itemIndex] = vote;
  }

  async delete(vote: CommentVote) {
    const itemIndex = this.items.findIndex((item) => item.id === vote.id);

    this.items.splice(itemIndex, 1);
  }
}
