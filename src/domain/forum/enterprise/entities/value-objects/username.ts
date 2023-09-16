import { Either, left, right } from '@/core/either';

import { InvalidUsernameError } from './errors/invalid-username-error';

export class Username {
  private _value: string;

  protected constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static validate(username: string): boolean {
    const usernameRegex = /^[a-z0-9_-]{4,20}$/;

    return usernameRegex.test(username);
  }

  static create(username: string): Either<InvalidUsernameError, Username> {
    const isValidUsername = this.validate(username);

    if (!isValidUsername) {
      return left(new InvalidUsernameError(username));
    }

    return right(new Username(username));
  }
}
