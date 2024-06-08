import { Args, Query, Resolver } from '@nestjs/graphql';

import { UnitService } from './unit.service';
import { ConversionResult } from '../graphql';

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

  @Query(() => ConversionResult)
  async convertUnit(
    @Args('amount') amount: number,
    @Args('unitName') unitName: string,
    @Args('desiredUnitName') desiredUnitName: string,
  ): Promise<ConversionResult> {
    return await this.unitService.convertUnits(
      amount,
      unitName,
      desiredUnitName,
    );
  }
}
