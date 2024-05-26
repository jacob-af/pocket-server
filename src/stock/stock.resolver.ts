import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

//import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { StockService } from './stock.service';
import { CreateStockInput } from 'src/graphql';
import { UnitService } from 'src/unit/unit.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { BuildService } from 'src/build/build.service';

@Resolver('Stock')
export class StockResolver {
  constructor(
    private readonly stockService: StockService,
    private readonly unitService: UnitService,
    private readonly ingredientService: IngredientService,
    private readonly buildService: BuildService,
  ) {}

  @Query('findAllStock')
  async findAllStock() {
    return await this.stockService.findAll();
  }

  @Mutation('createStock')
  async createStock(
    @Args('createStock') createStock: CreateStockInput,
    //@CurrentUserId() userId: string,
  ) {
    console.log(createStock);
    const stock = await this.stockService.create(createStock);
    // const permission = await this.stockService.changePermission(
    //   stock.id,
    //   userId,
    //   Permission.OWNER,
    // );

    return {
      ...stock,
      //permission,
    };
  }

  @ResolveField('unit')
  async unit(@Parent() stock) {
    console.log(stock);
    return this.unitService.findOne(stock.unitAbb);
  }
  @ResolveField('ingredient')
  async ingredient(@Parent() stock) {
    console.log(stock);
    return this.ingredientService.ingredient(stock.ingredientName);
  }
  @ResolveField('buildRef')
  async buildRef(@Parent() stock) {
    console.log(stock);
    return this.buildService.findBuildById(stock.buildId);
  }
}
