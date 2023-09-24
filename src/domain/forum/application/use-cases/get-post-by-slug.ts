import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/post-with-author';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type GetPostBySlugUseCaseRequest = {
  slug: string;
};

type GetPostBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    post: PostWithAuthor;
  }
>;

@Injectable()
export class GetPostBySlugUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    slug,
  }: GetPostBySlugUseCaseRequest): Promise<GetPostBySlugUseCaseResponse> {
    const post = await this.postsRepository.findBySlug(slug);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    return right({
      post,
    });
  }
}
