import { WatchedList } from '@/core/entities/watched-list';
import { CommentVote } from './comment-vote';

export class CommentVoteList extends WatchedList<CommentVote> {
  compareItems(a: CommentVote, b: CommentVote): boolean {
    return a.id.equals(b.id);
  }
}
