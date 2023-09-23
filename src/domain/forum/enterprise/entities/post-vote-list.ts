import { WatchedList } from '@/core/entities/watched-list';
import { PostVote } from './post-vote';

export class PostVoteList extends WatchedList<PostVote> {
  compareItems(a: PostVote, b: PostVote): boolean {
    return a.id.equals(b.id);
  }
}
