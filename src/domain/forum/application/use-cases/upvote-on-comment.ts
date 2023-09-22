import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { CommentVote } from '@/domain/forum/enterprise/entities/comment-vote';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';
import { CommentVotesRepository } from '@/domain/forum/application/repositories/comment-votes-repository';

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
    private readonly commentsRepository: CommentsRepository,
    private readonly commentVotesRepository: CommentVotesRepository,
  ) {}

  async execute({
    commentId,
    authorId,
  }: UpvoteOnCommentUseCaseRequest): Promise<UpvoteOnCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    const vote = CommentVote.create({
      authorId: new UniqueEntityID(authorId),
      commentId: new UniqueEntityID(commentId),
      type: 'UPVOTE',
    });

    await this.commentVotesRepository.create(vote);

    return right({
      vote,
    });
  }
}
