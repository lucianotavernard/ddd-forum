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

  async findAllForCommentByAuthorId(
    commentId: string,
    authorId: string,
  ): Promise<CommentVote[]> {
    const votes = this.items.filter((item) => {
      return (
        item.commentId.toString() === commentId &&
        item.authorId.toString() === authorId
      );
    });

    return votes;
  }

  async createMany(votes: CommentVote[]): Promise<void> {
    this.items.push(...votes);
  }

  async deleteMany(votes: CommentVote[]): Promise<void> {
    const commentVotes = this.items.filter((item) => {
      return !votes.some((vote) => vote.equals(item));
    });

    this.items = commentVotes;
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
