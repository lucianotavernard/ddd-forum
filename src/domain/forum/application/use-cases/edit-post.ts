import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/either';

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { Post } from '@/domain/forum/enterprise/entities/post';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';

type EditPostUseCaseRequest = {
  authorId: string;
  postId: string;
  title: string;
  content: string;
};

type EditPostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    post: Post;
  }
>;

@Injectable()
export class EditPostUseCase {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    authorId,
    postId,
    title,
    content,
  }: EditPostUseCaseRequest): Promise<EditPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== post.authorId.toString()) {
      return left(new NotAllowedError());
    }

    post.title = title;
    post.content = content;

    await this.postsRepository.save(post);

    return right({
      post,
    });
  }
}
