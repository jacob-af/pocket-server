import { Test, TestingModule } from '@nestjs/testing';
import { TouchService } from './touch.service';

describe('TouchService', () => {
  let service: TouchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TouchService],
    }).compile();

    service = module.get<TouchService>(TouchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
