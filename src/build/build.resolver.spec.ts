import { Test, TestingModule } from '@nestjs/testing';
import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';

describe('BuildResolver', () => {
  let resolver: BuildResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildResolver, BuildService],
    }).compile();

    resolver = module.get<BuildResolver>(BuildResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
