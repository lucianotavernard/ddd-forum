import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import { Comment } from '@/domain/forum/enterprise/entities/comment';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

type FetchCommentsUseCaseRequest = {
  postId: string;
  page: number;
  per_page?: number;
};

type FetchCommentsUseCaseResponse = Either<
  null,
  {
    comments: Comment[];
  }
>;

@Injectable()
export class FetchCommentsFromPostUseCase {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute({
    postId,
    page,
    per_page = 10,
  }: FetchCommentsUseCaseRequest): Promise<FetchCommentsUseCaseResponse> {
    const comments = await this.commentsRepository.findManyByPostId(postId, {
      page,
      per_page,
    });

    return right({
      comments,
    });
  }
}
