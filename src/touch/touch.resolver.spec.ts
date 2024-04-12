import { Test, TestingModule } from '@nestjs/testing';
import { TouchResolver } from './touch.resolver';
import { TouchService } from './touch.service';

describe('TouchResolver', () => {
  let resolver: TouchResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TouchResolver, TouchService],
    }).compile();

    resolver = module.get<TouchResolver>(TouchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
