import { Test, TestingModule } from '@nestjs/testing';
import { RecipeBookService } from './recipe-book.service';

describe('RecipeBookService', () => {
  let service: RecipeBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeBookService],
    }).compile();

    service = module.get<RecipeBookService>(RecipeBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
