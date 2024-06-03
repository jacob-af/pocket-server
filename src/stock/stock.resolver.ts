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
import { InventoryService } from 'src/inventory/inventory.service';

@Resolver('Stock')
export class StockResolver {
  constructor(
    private readonly stockService: StockService,
    private readonly unitService: UnitService,
    private readonly ingredientService: IngredientService,
    private readonly buildService: BuildService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Query('findAllStock')
  async findAllStock() {
    return await this.stockService.findAll();
  }

  @Query('findOneStock')
  async findOneStock(
    @Args('ingredientName') ingredientName: string,
    @Args('inventoryId') inventoryId: string,
  ) {
    return await this.stockService.findOne(ingredientName, inventoryId);
  }
  @Query('findManyStocks')
  async findManyStocks(
    @Args('inventoryId') inventoryId: string,
    @Args('skip') skip: number,
    @Args('take') take: number,
  ) {
    return await this.stockService.findMany(inventoryId, skip, take);
  }

  @Mutation('createStock')
  async createStock(
    @Args('createStock') createStock: CreateStockInput,
    @Args('inventoryId') inventoryId: string,
  ) {
    console.log(createStock);
    const stock = await this.stockService.create(createStock, inventoryId);

    return stock;
  }

  @Mutation('createManyStocks')
  async createManyStocks(
    @Args('createManyStocks') createManyStocks: CreateStockInput[],
    @Args('inventoryId') inventoryId: string,
  ) {
    const stock = await this.stockService.createMany(
      createManyStocks,
      inventoryId,
    );
    return {
      ...stock,
      //permission,
    };
  }

  @ResolveField('unit')
  async unit(@Parent() stock) {
    return this.unitService.findOne(stock.unitAbb);
  }
  @ResolveField('ingredient')
  async ingredient(@Parent() stock) {
    return this.ingredientService.ingredient(stock.ingredientName);
  }
  @ResolveField('inventory')
  async inventory(@Parent() stock) {
    return this.inventoryService.findOne(stock.inventoryId);
  }
  @ResolveField('buildRef')
  async buildRef(@Parent() stock) {
    return this.buildService.findBuildById(stock.buildId);
  }

  @ResolveField()
  async pricePerOunce(@Parent() stock) {
    return await this.stockService.pricePerOunce(stock);
  }
}
