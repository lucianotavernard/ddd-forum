import dayjs from 'dayjs';

import { Optional } from '@/core/types/optional';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Slug } from './value-objects/slug';
import { PostVoteList } from './post-vote-list';

export type PostProps = {
  authorId: UniqueEntityID;
  slug: Slug;
  title: string;
  content: string;
  points: number;
  votes: PostVoteList;
  createdAt: Date;
  updatedAt?: Date;
};

export class Post extends AggregateRoot<PostProps> {
  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get votes() {
    return this.props.votes;
  }

  get slug() {
    return this.props.slug;
  }

  get points() {
    return this.props.points;
  }

  set points(points: number) {
    this.props.points = points;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<PostProps, 'createdAt' | 'slug' | 'points' | 'votes'>,
    id?: UniqueEntityID,
  ) {
    const post = new Post(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        points: props.points ?? 0,
        votes: props.votes ?? new PostVoteList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return post;
  }
}
