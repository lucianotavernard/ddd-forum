import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { Comment } from '@/domain/forum/enterprise/entities/comment';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

type EditCommentUseCaseRequest = {
  commentId: string;
  authorId: string;
  content: string;
};

type EditCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    comment: Comment;
  }
>;

@Injectable()
export class EditCommentUseCase {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    authorId,
    content,
  }: EditCommentUseCaseRequest): Promise<EditCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== comment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    comment.content = content;

    await this.commentsRepository.save(comment);

    return right({
      comment,
    });
  }
}
