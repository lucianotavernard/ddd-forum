import { PostVotesRepository } from '@/domain/forum/application/repositories/post-votes-repository';
import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';

export class InMemoryPostVotesRepository implements PostVotesRepository {
  public items: PostVote[] = [];

  async findById(id: string) {
    const vote = this.items.find((item) => item.id.toString() === id);

    if (!vote) {
      return null;
    }

    return vote;
  }

  async findAllForPostByAuthorId(
    postId: string,
    authorId: string,
  ): Promise<PostVote[]> {
    const votes = this.items.filter((item) => {
      return (
        item.postId.toString() === postId &&
        item.authorId.toString() === authorId
      );
    });

    return votes;
  }

  async createMany(votes: PostVote[]): Promise<void> {
    this.items.push(...votes);
  }

  async deleteMany(votes: PostVote[]): Promise<void> {
    const postVotes = this.items.filter((item) => {
      return !votes.some((vote) => vote.equals(item));
    });

    this.items = postVotes;
  }

  async create(vote: PostVote) {
    this.items.push(vote);
  }

  async save(vote: PostVote) {
    const itemIndex = this.items.findIndex((item) => item.id === vote.id);

    this.items[itemIndex] = vote;
  }

  async delete(vote: PostVote) {
    const itemIndex = this.items.findIndex((item) => item.id === vote.id);

    this.items.splice(itemIndex, 1);
  }
}
