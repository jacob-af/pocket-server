import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CurrentUserId } from 'src/auth/decorators/currentUserId-decorator';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('allUsers')
  allUsers() {
    return this.userService.findAll();
  }

  @Query('userById')
  userById(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Mutation('followUser')
  followUser(
    @Args('followId') followId: string,
    @Args('relationship') relationship: string,
    @CurrentUserId() userId: string,
  ) {
    return this.userService.followUser(followId, relationship, userId);
  }

  @ResolveField()
  async following(@Parent() user) {
    const id: string = user.id;
    return await this.userService.findFollows(id);
  }

  @ResolveField()
  async followedBy(@Parent() user) {
    const id: string = user.id;
    return await this.userService.findFollowers(id);
  }

  @Query()
  hello() {
    return 'Helsdfglrld';
  }
}
