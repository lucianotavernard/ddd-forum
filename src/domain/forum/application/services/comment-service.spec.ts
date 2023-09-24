import { CommentService } from './comment-service';

import { InMemoryCommentVotesRepository } from 'test/repositories/in-memory-comment-votes-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';

import { makeAuthor } from 'test/factories/make-author';
import { makeComment } from 'test/factories/make-comment';
import {
  makeCommentDownvote,
  makeCommentUpvote,
} from 'test/factories/make-comment-vote';

let inMemoryCommentVotesRepository: InMemoryCommentVotesRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;

let sut: CommentService;

describe('Comment Service', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryCommentVotesRepository = new InMemoryCommentVotesRepository();
    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryCommentVotesRepository,
    );

    sut = new CommentService();
  });

  it('should be able to upvote a comment', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryCommentsRepository.create(comment);

    const result = sut.upvoteComment(comment, author, []);

    expect(result).toBe(true);
  });

  it('should be able to upvote a comment within upvotes', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });
    const vote = makeCommentUpvote({
      authorId: author.id,
      commentId: comment.id,
    });

    inMemoryAuthorsRepository.create(author);
    inMemoryCommentsRepository.create(comment);
    inMemoryCommentVotesRepository.create(vote);

    const result = sut.upvoteComment(comment, author, [vote]);

    expect(result).toBe(false);
  });

  it('should be able to upvote a comment within downvotes', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });
    const vote = makeCommentDownvote({
      authorId: author.id,
      commentId: comment.id,
    });

    inMemoryAuthorsRepository.create(author);
    inMemoryCommentsRepository.create(comment);
    inMemoryCommentVotesRepository.create(vote);

    const result = sut.upvoteComment(comment, author, [vote]);

    expect(result).toBe(false);
  });

  it('should be able to downvote a comment', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryCommentsRepository.create(comment);

    const result = sut.downvoteComment(comment, author, []);

    expect(result).toBe(true);
  });

  it('should be able to downvote a comment within downvotes', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });
    const vote = makeCommentDownvote({
      authorId: author.id,
      commentId: comment.id,
    });

    inMemoryAuthorsRepository.create(author);
    inMemoryCommentsRepository.create(comment);
    inMemoryCommentVotesRepository.create(vote);

    const result = sut.downvoteComment(comment, author, [vote]);

    expect(result).toBe(false);
  });

  it('should be able to downvote a comment within upvotes', async () => {
    const author = makeAuthor();
    const comment = makeComment({ authorId: author.id });
    const vote = makeCommentUpvote({
      authorId: author.id,
      commentId: comment.id,
    });

    inMemoryAuthorsRepository.create(author);
    inMemoryCommentsRepository.create(comment);
    inMemoryCommentVotesRepository.create(vote);

    const result = sut.downvoteComment(comment, author, [vote]);

    expect(result).toBe(false);
  });
});
