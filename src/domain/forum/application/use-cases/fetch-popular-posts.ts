import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import { PostWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/post-with-author';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type FetchPopularPostsUseCaseRequest = {
  page: number;
  per_page?: number;
};

type FetchPopularPostsUseCaseResponse = Either<
  null,
  {
    posts: PostWithAuthor[];
  }
>;

@Injectable()
export class FetchPopularPostsUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    page,
    per_page = 10,
  }: FetchPopularPostsUseCaseRequest): Promise<FetchPopularPostsUseCaseResponse> {
    const posts = await this.postsRepository.findManyPopular({
      page,
      per_page,
    });

    return right({
      posts,
    });
  }
}
