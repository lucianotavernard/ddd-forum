import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { UpvoteOnCommentUseCase } from './upvote-on-comment';
import { CommentService } from '@/domain/forum/application/services/comment-service';

import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryCommentVotesRepository } from 'test/repositories/in-memory-comment-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';
import { makeComment } from 'test/factories/make-comment';

let commentService: CommentService;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let inMemoryCommentVotesRepository: InMemoryCommentVotesRepository;
let sut: UpvoteOnCommentUseCase;

describe('Upvote on Comment', () => {
  beforeEach(() => {
    commentService = new CommentService();

    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();
    inMemoryCommentVotesRepository = new InMemoryCommentVotesRepository();
    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryCommentVotesRepository,
    );

    sut = new UpvoteOnCommentUseCase(
      commentService,
      inMemoryCommentsRepository,
      inMemoryCommentVotesRepository,
      inMemoryAuthorsRepository,
    );
  });

  it('should be able to upvote on comment', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });

    await inMemoryAuthorsRepository.create(author);
    await inMemoryCommentsRepository.create(comment);

    await sut.execute({
      commentId: comment.id.toString(),
      authorId: comment.authorId.toString(),
    });

    const result = inMemoryCommentVotesRepository.items[0];

    expect(result.isUpvote).toBeTruthy();
    expect(result.commentId.equals(comment.id)).toBeTruthy();
    expect(result.authorId.equals(comment.authorId)).toBeTruthy();
  });

  it('should not be able to upvote on non-existing comment', async () => {
    const result = await sut.execute({
      commentId: 'comment-1',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
