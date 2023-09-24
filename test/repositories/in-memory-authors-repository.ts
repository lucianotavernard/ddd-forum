import { AuthorsRepository } from '@/domain/forum/application/repositories/authors-repository';
import { Author } from '@/domain/forum/enterprise/entities/author';

export class InMemoryAuthorsRepository implements AuthorsRepository {
  public items: Author[] = [];

  async findAllAuthors() {
    return this.items;
  }

  async findById(id: string) {
    const author = this.items.find((item) => item.id.toString() === id);

    if (!author) {
      return null;
    }

    return author;
  }

  async findByEmail(email: string) {
    const author = this.items.find(
      (item) => item.email.value.toString() === email,
    );

    if (!author) {
      return null;
    }

    return author;
  }

  async findByUsername(username: string) {
    const author = this.items.find(
      (item) => item.username.value.toString() === username,
    );

    if (!author) {
      return null;
    }

    return author;
  }

  async create(author: Author) {
    this.items.push(author);
  }

  async save(author: Author) {
    const itemIndex = this.items.findIndex((item) => item.id === author.id);

    this.items[itemIndex] = author;
  }
}
