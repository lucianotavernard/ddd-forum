import { UseCaseError } from '@/core/errors/use-case-error';

export class EmailAlreadyExistsError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`);
    this.name = 'EmailAlreadyExistsError';
  }
}
