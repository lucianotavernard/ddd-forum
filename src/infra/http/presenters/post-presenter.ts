import { Post } from '@/domain/forum/enterprise/entities/post';

export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id.toString(),
      title: post.title,
      slug: post.slug.value,
      points: post.points,
      excerpt: post.excerpt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
