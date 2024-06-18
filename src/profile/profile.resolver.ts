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
import { RecipeService } from 'src/recipe/recipe.service';
import { BuildService } from 'src/build/build.service';

@Resolver('Profile')
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly recipeBookService: RecipeBookService,
    private readonly recipeService: RecipeService,
    private readonly buildService: BuildService,
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

  @ResolveField('recipes')
  async recipes(@CurrentUserId() userId: string) {
    return await this.recipeService.allRecipes({
      where: { createdById: userId },
    });
  }
  @ResolveField('builds')
  async builds(@CurrentUserId() userId: string) {
    return await this.buildService.allBuilds({
      where: { createdById: userId },
    });
  }

  @ResolveField('books')
  async books(@CurrentUserId() userId: string) {
    return await this.recipeBookService.allBooks({
      where: { createdById: userId },
    });
  }
}
