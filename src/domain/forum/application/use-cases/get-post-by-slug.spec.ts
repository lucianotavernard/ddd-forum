import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

import { GetPostBySlugUseCase } from './get-post-by-slug';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';
import { makeAuthor } from 'test/factories/make-author';
import { makePost } from 'test/factories/make-post';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: GetPostBySlugUseCase;

describe('Get Post By Slug', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new GetPostBySlugUseCase(inMemoryPostsRepository);
  });

  it('should be able to get a post by slug', async () => {
    const author = makeAuthor();

    const post = makePost({
      authorId: author.id,
      slug: Slug.create('example-post'),
    });

    await inMemoryAuthorsRepository.create(author);
    await inMemoryPostsRepository.create(post);

    const result = await sut.execute({
      slug: 'example-post',
    });

    expect(result.value).toMatchObject({
      post: expect.objectContaining({
        isNew: post.isNew,
        slug: post.slug.value,
        title: post.title,
        author: author.name,
        points: post.points,
        excerpt: post.excerpt,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        authorId: post.authorId,
        postId: post.id,
      }),
    });
  });

  it('should not be able to get a non-existing post by slug', async () => {
    const result = await sut.execute({
      slug: 'post-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
