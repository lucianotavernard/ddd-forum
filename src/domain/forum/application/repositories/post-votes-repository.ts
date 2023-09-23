import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';

export abstract class PostVotesRepository {
  abstract findById(id: string): Promise<PostVote | null>;

  abstract findAllForPostByAuthorId(
    postId: string,
    authorId: string,
  ): Promise<PostVote[]>;

  abstract createMany(votes: PostVote[]): Promise<void>;
  abstract deleteMany(votes: PostVote[]): Promise<void>;

  abstract save(vote: PostVote): Promise<void>;
}
