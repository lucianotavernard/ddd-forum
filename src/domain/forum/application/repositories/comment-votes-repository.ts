import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';

export abstract class CommentVotesRepository {
  abstract findById(id: string): Promise<CommentVote | null>;

  abstract findAllForCommentByAuthorId(
    commentId: string,
    authorId: string,
  ): Promise<CommentVote[]>;

  abstract createMany(votes: CommentVote[]): Promise<void>;
  abstract deleteMany(votes: CommentVote[]): Promise<void>;

  abstract save(vote: CommentVote): Promise<void>;
}
