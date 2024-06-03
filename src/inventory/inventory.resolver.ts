import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { Permission } from 'src/graphql';
import { StockService } from 'src/stock/stock.service';

@Resolver('Inventory')
export class InventoryResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stockService: StockService,
  ) {}

  @Query('allInventory')
  async allInventory() {
    return await this.inventoryService.findAll();
  }
  @Query('oneInventory')
  async oneInventory(@Args('inventoryId') inventoryId: string) {
    return await this.inventoryService.findOne(inventoryId);
  }

  @Query('userInventory')
  async userInventory(@CurrentUserId() userId: string) {
    return await this.inventoryService.userInventory(userId);
  }

  @Mutation('createInventory')
  async createInventory(
    @Args('name') name: string,
    @Args('description') description: string,
    @CurrentUserId() userId: string,
  ) {
    const inv = await this.inventoryService.create(name, description, userId);
    const permission = await this.inventoryService.changePermission(
      inv.id,
      userId,
      Permission.OWNER,
    );
    return {
      ...inv,
      permission,
    };
  }
}
