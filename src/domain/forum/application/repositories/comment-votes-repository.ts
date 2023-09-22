import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';

export abstract class CommentVotesRepository {
  abstract findById(id: string): Promise<CommentVote | null>;
  abstract save(vote: CommentVote): Promise<void>;
  abstract create(vote: CommentVote): Promise<void>;
  abstract delete(vote: CommentVote): Promise<void>;
}
