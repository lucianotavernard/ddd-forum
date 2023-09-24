import { PostService } from './post-service';

import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';

import { makeAuthor } from 'test/factories/make-author';
import { makePost } from 'test/factories/make-post';
import {
  makePostDownvote,
  makePostUpvote,
} from 'test/factories/make-post-vote';

let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;

let sut: PostService;

describe('Post Service', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new PostService();
  });

  it('should be able to upvote a post', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryPostsRepository.create(post);

    const result = sut.upvotePost(post, author, []);

    expect(result).toBe(true);
  });

  it('should be able to upvote a post within upvotes', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });
    const vote = makePostUpvote({ authorId: author.id, postId: post.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryPostsRepository.create(post);
    inMemoryPostVotesRepository.create(vote);

    const result = sut.upvotePost(post, author, [vote]);

    expect(result).toBe(false);
  });

  it('should be able to upvote a post within downvotes', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });
    const vote = makePostDownvote({ authorId: author.id, postId: post.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryPostsRepository.create(post);
    inMemoryPostVotesRepository.create(vote);

    const result = sut.upvotePost(post, author, [vote]);

    expect(result).toBe(false);
  });

  it('should be able to downvote a post', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryPostsRepository.create(post);

    const result = sut.downvotePost(post, author, []);

    expect(result).toBe(true);
  });

  it('should be able to downvote a post within downvotes', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });
    const vote = makePostDownvote({ authorId: author.id, postId: post.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryPostsRepository.create(post);
    inMemoryPostVotesRepository.create(vote);

    const result = sut.downvotePost(post, author, [vote]);

    expect(result).toBe(false);
  });

  it('should be able to downvote a post within upvotes', async () => {
    const author = makeAuthor();
    const post = makePost({ authorId: author.id });
    const vote = makePostUpvote({ authorId: author.id, postId: post.id });

    inMemoryAuthorsRepository.create(author);
    inMemoryPostsRepository.create(post);
    inMemoryPostVotesRepository.create(vote);

    const result = sut.downvotePost(post, author, [vote]);

    expect(result).toBe(false);
  });
});
