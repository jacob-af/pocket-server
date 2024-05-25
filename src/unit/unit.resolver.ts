import { Args, Query, Resolver } from '@nestjs/graphql';

import { UnitService } from './unit.service';

@Resolver('Unit')
export class UnitResolver {
  constructor(private readonly unitService: UnitService) {}

  @Query('findAllUnits')
  findAll() {
    return this.unitService.findAll(null);
  }
  @Query('findSomeUnits')
  findSome(@Args('unitType') unitType: string) {
    if (unitType === '') {
      return this.unitService.findAll({ where: { unitType: { not: null } } });
    }
    return this.unitService.findAll({
      where: {
        OR: [{ unitType }, { unitType: 'common' }],
      },
    });
  }
}
