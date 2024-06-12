import { ProfileService } from './profile.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUserId } from '../auth/decorators/currentUserId-decorator';
import { Profile } from '../graphql';
import { RecipeBookService } from '../recipe-book/recipe-book.service';
import { InventoryService } from 'src/inventory/inventory.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly recipeBookService: RecipeBookService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Query('getProfile')
  getProfile(@CurrentUserId() userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Mutation('updateProfile') //Also used to create
  updateProfile(@Args('image') image: string, @CurrentUserId() userId: string) {
    console.log(image, userId);
    return this.profileService.updateProfile(userId, image);
  }

  @ResolveField('preferredBook')
  async preferredBook(
    @Parent() profile: Profile,
    @CurrentUserId() userId: string,
  ) {
    return await this.recipeBookService.findOne(
      profile.preferredBookName,
      userId,
    );
  }
  @ResolveField('preferredInventory')
  async preferredInventory(@Parent() profile: Profile) {
    return await this.inventoryService.findOne(profile.preferredInventoryId);
  }
}
