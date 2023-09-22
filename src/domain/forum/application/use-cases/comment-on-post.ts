import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { Comment } from '@/domain/forum/enterprise/entities/comment';
import { PostsRepository } from '@/domain/forum/application/repositories/posts-repository';
import { CommentsRepository } from '@/domain/forum/application/repositories/comments-repository';

type CommentOnPostUseCaseRequest = {
  authorId: string;
  postId: string;
  content: string;
};

type CommentOnPostUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comment: Comment;
  }
>;

@Injectable()
export class CommentOnPostUseCase {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
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

    const comment = Comment.create({
      authorId: new UniqueEntityID(authorId),
      postId: new UniqueEntityID(postId),
      content,
    });

    await this.commentsRepository.create(comment);

    return right({
      comment,
    });
  }
}
