import { Author } from '@/domain/forum/enterprise/entities/author';

export abstract class AuthorsRepository {
  abstract findById(id: string): Promise<Author | null>;
  abstract findByEmail(email: string): Promise<Author | null>;
  abstract findByUsername(username: string): Promise<Author | null>;
  abstract findAllAuthors(): Promise<Author[]>;
  abstract create(author: Author): Promise<void>;
  abstract save(author: Author): Promise<void>;
}
