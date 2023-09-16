import { Either, right } from '@/core/either';

import { Post } from '@/domain/forum/enterprise/entities/post';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type FetchRecentPostsUseCaseRequest = {
  page: number;
  per_page?: number;
};

type FetchRecentPostsUseCaseResponse = Either<
  null,
  {
    posts: Post[];
  }
>;

export class FetchRecentPostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    page,
    per_page = 10,
  }: FetchRecentPostsUseCaseRequest): Promise<FetchRecentPostsUseCaseResponse> {
    const posts = await this.postsRepository.findManyRecent({
      page,
      per_page,
    });

    return right({
      posts,
    });
  }
}
