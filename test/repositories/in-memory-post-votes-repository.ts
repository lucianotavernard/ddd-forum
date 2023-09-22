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
