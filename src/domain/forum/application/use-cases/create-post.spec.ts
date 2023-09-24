import { CreatePostUseCase } from './create-post';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { InMemoryPostVotesRepository } from 'test/repositories/in-memory-post-votes-repository';
import { InMemoryAuthorsRepository } from 'test/repositories/in-memory-authors-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryPostVotesRepository: InMemoryPostVotesRepository;
let inMemoryAuthorsRepository: InMemoryAuthorsRepository;
let sut: CreatePostUseCase;

describe('Create Post', () => {
  beforeEach(() => {
    inMemoryPostVotesRepository = new InMemoryPostVotesRepository();
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryPostVotesRepository,
      inMemoryAuthorsRepository,
    );

    sut = new CreatePostUseCase(inMemoryPostsRepository);
  });

  it('should be able to create a post', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'New post',
      content: 'Post content',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPostsRepository.items[0]).toEqual(result.value?.post);
  });
});
