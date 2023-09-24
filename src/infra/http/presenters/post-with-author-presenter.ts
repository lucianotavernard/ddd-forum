import { PostWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/post-with-author';

export class PostWithAuthorPresenter {
  static toHTTP(postWithAuthor: PostWithAuthor) {
    return {
      title: postWithAuthor.title,
      slug: postWithAuthor.slug,
      points: postWithAuthor.points,
      author: postWithAuthor.author,
      excerpt: postWithAuthor.excerpt,
      content: postWithAuthor.content,
      createdAt: postWithAuthor.createdAt,
      updatedAt: postWithAuthor.updatedAt,
      publishedAt: postWithAuthor.publishedAt,
    };
  }
}
