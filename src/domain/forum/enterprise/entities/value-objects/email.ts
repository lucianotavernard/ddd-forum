import { Either, left, right } from '@/core/either';

import { InvalidEmailError } from './errors/invalid-email-error';

export class Email {
  private _value: string;

  protected constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static validate(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    const isValidEmail = this.validate(email);

    if (!isValidEmail) {
      return left(new InvalidEmailError(email));
    }

    return right(new Email(email));
  }
}
