import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';

type DeletePostCommentUseCaseRequest = {
  authorId: string;
  postCommentId: string;
};

type DeletePostCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeletePostCommentUseCase {
  constructor(private postCommentsRepository: PostCommentsRepository) {}

  async execute({
    authorId,
    postCommentId,
  }: DeletePostCommentUseCaseRequest): Promise<DeletePostCommentUseCaseResponse> {
    const postComment =
      await this.postCommentsRepository.findById(postCommentId);

    if (!postComment) {
      return left(new ResourceNotFoundError());
    }

    if (postComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.postCommentsRepository.delete(postComment);

    return right(null);
  }
}
