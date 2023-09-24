import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export type PostWithAuthorProps = {
  postId: UniqueEntityID;
  authorId: UniqueEntityID;
  isNew: boolean;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  points: number;
  author: string;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class PostWithAuthor extends ValueObject<PostWithAuthorProps> {
  get postId() {
    return this.props.postId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get isNew() {
    return this.props.isNew;
  }

  get slug() {
    return this.props.slug;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get excerpt() {
    return this.props.excerpt;
  }

  get points() {
    return this.props.points;
  }

  get author() {
    return this.props.author;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: PostWithAuthorProps) {
    return new PostWithAuthor(props);
  }
}
