import { Resolver, Args, Mutation, Query, Int } from '@nestjs/graphql';
import { Book } from './books.entity';
import { BooksService } from './books.service';
import { BookInput } from './dtos/create-book.input';
import { UpdateBookInput } from './dtos/update-book.input';

@Resolver((of) => Book)
export class BooksResolver {
  constructor(private bookService: BooksService) {}

  @Query((type) => [Book])
  async getAllBooks() {
    return this.bookService.getAll();
  }

  @Query(() => [Book])
  searchBooks(@Args('query') query: string): Promise<Book[]> {
    // Logic for searching books based on the query parameter
    const books = this.bookService.searchBooks(query);
    return books;
  }

  @Mutation((returns) => Book)
  createBook(@Args('bookInput') bookInput: BookInput): Promise<Book> {
    return this.bookService.createBook(bookInput);
  }

  @Mutation((returns) => Book)
  editBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.bookService.editBook(id, updateBookInput);
  }

  @Mutation((returns) => Book)
  deleteBook(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
