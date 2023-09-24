import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';

import { PostWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/post-with-author';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type FetchRecentPostsUseCaseRequest = {
  page: number;
  per_page?: number;
};

type FetchRecentPostsUseCaseResponse = Either<
  null,
  {
    posts: PostWithAuthor[];
  }
>;

@Injectable()
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
