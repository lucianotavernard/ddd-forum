import { Either, right } from '@/core/either';

import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';
import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';

type FetchPostCommentsUseCaseRequest = {
  postId: string;
  page: number;
  per_page?: number;
};

type FetchPostCommentsUseCaseResponse = Either<
  null,
  {
    postComments: PostComment[];
  }
>;

export class FetchPostCommentsUseCase {
  constructor(
    private readonly postCommentsRepository: PostCommentsRepository,
  ) {}

  async execute({
    postId,
    page,
    per_page = 10,
  }: FetchPostCommentsUseCaseRequest): Promise<FetchPostCommentsUseCaseResponse> {
    const postComments = await this.postCommentsRepository.findManyByPostId(
      postId,
      {
        page,
        per_page,
      },
    );

    return right({
      postComments,
    });
  }
}
