import { CreatePostUseCase } from './create-post';

import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';

let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: CreatePostUseCase;

describe('Create Post', () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
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
