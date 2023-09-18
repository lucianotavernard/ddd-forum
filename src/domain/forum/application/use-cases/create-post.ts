import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';

import { Post } from '@/domain/forum/enterprise/entities/post';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type CreatePostUseCaseRequest = {
  authorId: string;
  title: string;
  content: string;
};

type CreatePostUseCaseResponse = Either<
  null,
  {
    post: Post;
  }
>;

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = Post.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    });

    await this.postsRepository.create(post);

    return right({
      post,
    });
  }
}
