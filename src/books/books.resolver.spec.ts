import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

const mockRepository = {
  id: Number,
  name: String,
  description: String,
};

const book = { id: 1, name: 'test', description: 'testing books' };

describe('BooksResolver', () => {
  let resolver: BooksResolver;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        BooksResolver,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    resolver = module.get<BooksResolver>(BooksResolver);
    service = module.get<BooksService>(BooksService);
  });

  describe('findAll books', () => {
    it('should return an array of books', async () => {
      const result = [book];
      jest
        .spyOn(service, 'getAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await resolver.getAllBooks()).toBe(result);
    });
  });

  describe('searchAll books', () => {
    it('should return an array of books matching the query', async () => {
      const result = [book];
      jest
        .spyOn(service, 'searchBooks')
        .mockImplementation(() => Promise.resolve(result));

      expect(await resolver.searchBooks('test')).toBe(result);
    });
  });

  describe('Create book', () => {
    it('should return a book object', async () => {
      // const data = book;
      jest
        .spyOn(service, 'createBook')
        .mockImplementation(() => Promise.resolve(book));

      expect(await resolver.createBook(book)).toBe(book);
    });
  });

  describe('Update book', () => {
    it('should return a book object when updated', async () => {
      const data = { id: 1, name: 'testing', description: 'testing books' };
      jest
        .spyOn(service, 'editBook')
        .mockImplementation(() => Promise.resolve(data));

      expect(await resolver.editBook(1, data)).toBe(data);
    });
  });

  describe('Delete book', () => {
    it('should delete a book', async () => {
      jest
        .spyOn(service, 'deleteBook')
        .mockImplementation(() => Promise.resolve(book));

      expect(await resolver.deleteBook(1)).toBe(book);
    });
  });
});
