import { Resolver } from '@nestjs/graphql';
import { UnitService } from './unit.service';

@Resolver('Unit')
export class UnitResolver {
  constructor(private readonly unitService: UnitService) {}
}
