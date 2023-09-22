import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';

export abstract class PostVotesRepository {
  abstract findById(id: string): Promise<PostVote | null>;
  abstract save(vote: PostVote): Promise<void>;
  abstract create(vote: PostVote): Promise<void>;
  abstract delete(vote: PostVote): Promise<void>;
}
