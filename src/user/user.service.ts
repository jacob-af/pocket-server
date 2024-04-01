import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return `This action returns a ${id} user`;
  }

  update() {
    return `This action update user`;
  }

  remove() {
    return `This action removeuser`;
  }
}
