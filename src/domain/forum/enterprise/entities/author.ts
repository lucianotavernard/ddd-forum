import { Entity } from '@/core/entities/entity';

import { Email } from './value-objects/email';
import { Username } from './value-objects/username';

import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type AuthorProps = {
  name: string;
  email: Email;
  username: Username;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class Author extends Entity<AuthorProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: Email) {
    this.props.email = email;
  }

  get username() {
    return this.props.username;
  }

  set username(username: Username) {
    this.props.username = username;
  }

  get password() {
    return this.props.password;
  }

  static create(
    props: Optional<AuthorProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const author = new Author(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return author;
  }
}
