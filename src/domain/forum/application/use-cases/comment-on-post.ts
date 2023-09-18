import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';

type CommentOnPostUseCaseRequest = {
  authorId: string;
  postId: string;
  content: string;
};

type CommentOnPostUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    postComment: PostComment;
  }
>;

@Injectable()
export class CommentOnPostUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly postCommentsRepository: PostCommentsRepository,
  ) {}

  async execute({
    authorId,
    postId,
    content,
  }: CommentOnPostUseCaseRequest): Promise<CommentOnPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    const postComment = PostComment.create({
      authorId: new UniqueEntityID(authorId),
      postId: new UniqueEntityID(postId),
      content,
    });

    await this.postCommentsRepository.create(postComment);

    return right({
      postComment,
    });
  }
}
