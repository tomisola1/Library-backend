import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { BookInput } from './dtos/create-book.input';
import { UpdateBookInput } from './dtos/update-book.input';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async getAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async createBook(bookInput: BookInput): Promise<Book> {
    const newBook = this.bookRepository.create(bookInput);

    return await this.bookRepository.save(newBook);
  }

  async editBook(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    const oldBook = await this.bookRepository.findOneBy({
      id,
    });
    oldBook.name = updateBookInput.name || oldBook.name;
    oldBook.description = updateBookInput.description || oldBook.description;

    return await this.bookRepository.save(oldBook);
  }

  async deleteBook(id: number): Promise<boolean> {
    try {
      const book = await this.bookRepository.findOneBy({ id });
      await this.bookRepository.remove(book);
      return true;
    } catch (error) {
      return false;
    }
  }
}
