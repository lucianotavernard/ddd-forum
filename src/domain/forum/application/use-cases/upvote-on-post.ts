import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';
import { PostVotesRepository } from '@/domain/forum/application/repositories/post-votes-repository';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { PostService } from '@/domain/forum/application/services/post-service';
import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';

type UpvoteOnPostUseCaseRequest = {
  postId: string;
  authorId: string;
};

type UpvoteOnPostUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    vote: PostVote;
  }
>;

@Injectable()
export class UpvoteOnPostUseCase {
  constructor(
    private readonly postService: PostService,
    private readonly postsRepository: PostsRepository,
    private readonly postVotesRepository: PostVotesRepository,
    private readonly authorsRepository: AuthorsRepository,
  ) {}

  async execute({
    postId,
    authorId,
  }: UpvoteOnPostUseCaseRequest): Promise<UpvoteOnPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    const author = await this.authorsRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    const existingVotesOnPostByAuthor =
      await this.postVotesRepository.findAllForPostByAuthorId(postId, authorId);

    this.postService.upvotePost(post, author, existingVotesOnPostByAuthor);

    await this.postsRepository.save(post);

    return right(undefined);
  }
}
