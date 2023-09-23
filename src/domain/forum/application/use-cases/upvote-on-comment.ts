import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';
import { CommentService } from '@/domain/forum/application/services/comment-service';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';
import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';
import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';

type UpvoteOnCommentUseCaseRequest = {
  commentId: string;
  authorId: string;
};

type UpvoteOnCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    vote: CommentVote;
  }
>;

@Injectable()
export class UpvoteOnCommentUseCase {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentsRepository: CommentsRepository,
    private readonly commentVotesRepository: CommentVotesRepository,
    private readonly authorsRepository: AuthorsRepository,
  ) {}

  async execute({
    commentId,
    authorId,
  }: UpvoteOnCommentUseCaseRequest): Promise<UpvoteOnCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    const author = await this.authorsRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    const existingVotesOnPostByAuthor =
      await this.commentVotesRepository.findAllForCommentByAuthorId(
        commentId,
        authorId,
      );

    this.commentService.upvoteComment(
      comment,
      author,
      existingVotesOnPostByAuthor,
    );

    await this.commentsRepository.save(comment);

    return right(undefined);
  }
}
