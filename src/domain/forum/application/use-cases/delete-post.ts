import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type DeletePostUseCaseRequest = {
  postId: string;
  authorId: string;
};

type DeletePostUseCaseResponse = Either<ResourceNotFoundError, undefined>;

export class DeletePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    postId,
    authorId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== post.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.postsRepository.delete(post);

    return right(undefined);
  }
}
