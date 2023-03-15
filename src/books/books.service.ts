import { Injectable, NotFoundException } from '@nestjs/common';
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

  //Get the list of books
  async getAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  //Search for books
  async searchBooks(query: string): Promise<Book[]> {
    const books = await this.bookRepository
      //The query builder is used to create a query that searches for books with a name or description that matches the search parameters.
      .createQueryBuilder('book')
      .where('book.name LIKE :search', { search: `%${query}%` })
      .orWhere('book.description LIKE :search', { search: `%${query}%` })
      .getMany();

    return books;
  }

  //Create new books
  async createBook(bookInput: BookInput): Promise<Book> {
    try {
      //Create a new instance of the book entity
      const newBook = this.bookRepository.create(bookInput);
      //Save created book in the database
      return await this.bookRepository.save(newBook);
    } catch (error) {
      console.log(error);
    }
  }

  //Update a book
  async editBook(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    try {
      // Retrieve the book object from the database using the ID
      const oldBook = await this.bookRepository.findOneBy({
        id,
      });
      //Throw an error if the book is not found
      if (oldBook === null) {
        throw new NotFoundException(`Book with id ${id} is not available`);
      }
      // Update the book object with the new data from the DTO or leave the old
      oldBook.name = updateBookInput.name || oldBook.name;
      oldBook.description = updateBookInput.description || oldBook.description;
      // Save the book in the database
      return await this.bookRepository.save(oldBook);
    } catch (error) {
      console.log(error);
    }
  }

  //Delete a book
  async deleteBook(id: number): Promise<Book> {
    try {
      // Retrieve the book object from the database using the ID
      const book = await this.bookRepository.findOneBy({ id });
      //Throw an error if the book is not found
      if (book === null) {
        throw new NotFoundException(`Book with id ${id} is not available`);
      }
      //Remove the book object from the database
      await this.bookRepository.remove(book);

      return book;
    } catch (error) {
      console.log(error);
    }
  }
}
