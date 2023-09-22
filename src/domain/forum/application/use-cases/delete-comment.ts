import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

type DeleteCommentUseCaseRequest = {
  authorId: string;
  commentId: string;
};

type DeleteCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteCommentUseCase {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({
    authorId,
    commentId,
  }: DeleteCommentUseCaseRequest): Promise<DeleteCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.commentsRepository.delete(comment);

    return right(null);
  }
}
