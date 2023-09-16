import { UseCaseError } from '@/core/errors/use-case-error';

export class UsernameAlreadyExistsError extends Error implements UseCaseError {
  constructor(username: string) {
    super(`The username "${username}" is already registered.`);
    this.name = 'UsernameAlreadyExistsError';
  }
}
