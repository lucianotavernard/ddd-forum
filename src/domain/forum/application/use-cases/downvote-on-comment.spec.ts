import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { DownvoteOnCommentUseCase } from './downvote-on-comment';
import { CommentService } from '@/domain/forum/application/services/comment-service';

import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryCommentVotesRepository } from 'test/repositories/in-memory-comment-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';
import { makeComment } from 'test/factories/make-comment';

let commentService: CommentService;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryCommentVotesRepository: InMemoryCommentVotesRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: DownvoteOnCommentUseCase;

describe('Downvote on Comment', () => {
  beforeEach(() => {
    commentService = new CommentService();

    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    inMemoryCommentVotesRepository = new InMemoryCommentVotesRepository();
    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryCommentVotesRepository,
    );

    sut = new DownvoteOnCommentUseCase(
      commentService,
      inMemoryCommentsRepository,
      inMemoryCommentVotesRepository,
      inMemoryAuthorsRepository,
    );
  });

  it('should be able to downvote on comment', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });

    await inMemoryAuthorsRepository.create(author);
    await inMemoryCommentsRepository.create(comment);

    await sut.execute({
      commentId: comment.id.toString(),
      authorId: author.id.toString(),
    });

    const result = inMemoryCommentVotesRepository.items[0];

    expect(result.isDownvote).toBeTruthy();
    expect(result.commentId.equals(comment.id)).toBeTruthy();
    expect(result.authorId.equals(comment.authorId)).toBeTruthy();
  });

  it('should not be able to downvote on non-existing comment', async () => {
    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
