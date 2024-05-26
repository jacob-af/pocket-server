import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { Permission } from 'src/graphql';

@Resolver('Inventory')
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Query('allInventory')
  async allInventory() {
    await this.inventoryService.findAll();
  }
  @Query('oneInventory')
  async oneInventory(@Args('inventoryId') inventoryId: string) {
    await this.inventoryService.findOne(inventoryId);
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
