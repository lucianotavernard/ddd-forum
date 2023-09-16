import { Either, left, right } from '@/core/either';

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { PostComment } from '@/domain/forum/enterprise/entities/post-comment';
import { PostCommentsRepository } from '@/domain/forum/application/repositories/post-comments-repository';

type EditCommentOnPostUseCaseRequest = {
  authorId: string;
  postCommentId: string;
  content: string;
};

type EditCommentOnPostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    postComment: PostComment;
  }
>;

export class EditCommentOnPostUseCase {
  constructor(
    private readonly postCommentsRepository: PostCommentsRepository,
  ) {}

  async execute({
    authorId,
    postCommentId,
    content,
  }: EditCommentOnPostUseCaseRequest): Promise<EditCommentOnPostUseCaseResponse> {
    const postComment =
      await this.postCommentsRepository.findById(postCommentId);

    if (!postComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== postComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    postComment.content = content;

    await this.postCommentsRepository.save(postComment);

    return right({
      postComment,
    });
  }
}
