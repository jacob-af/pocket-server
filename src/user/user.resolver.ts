import { Resolver, Query, Args } from '@nestjs/graphql';
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
}
