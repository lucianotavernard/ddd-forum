import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { PostVotesRepository } from '@/domain/forum/application/repositories/post-votes-repository';

type DownvoteOnPostUseCaseRequest = {
  postId: string;
  authorId: string;
};

type DownvoteOnPostUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    vote: PostVote;
  }
>;

@Injectable()
export class DownvoteOnPostUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postVotesRepository: PostVotesRepository,
  ) {}

  async execute({
    postId,
    authorId,
  }: DownvoteOnPostUseCaseRequest): Promise<DownvoteOnPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    const vote = PostVote.create({
      authorId: new UniqueEntityID(authorId),
      postId: new UniqueEntityID(postId),
      type: 'DOWNVOTE',
    });

    await this.postVotesRepository.create(vote);

    return right({
      vote,
    });
  }
}
