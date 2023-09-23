import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostVote } from '@/domain/forum/enterprise/entities/post-vote';
import { PostService } from '@/domain/forum/application/services/post-service';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { PostVotesRepository } from '@/domain/forum/application/repositories/post-votes-repository';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';

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
    private readonly postService: PostService,
    private readonly postsRepository: PostsRepository,
    private readonly postVotesRepository: PostVotesRepository,
    private readonly authorsRepository: AuthorsRepository,
  ) {}

  async execute({
    postId,
    authorId,
  }: DownvoteOnPostUseCaseRequest): Promise<DownvoteOnPostUseCaseResponse> {
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

    this.postService.downvotePost(post, author, existingVotesOnPostByAuthor);

    await this.postsRepository.save(post);

    return right(undefined);
  }
}
