import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany();
  }
  findOne(id: string) {
    return `This action returns a ${id} user`;
  }

  async findFollows(userId: string) {
    console.log(userId);
    const res = await this.prisma.follow.findMany({
      where: { followedById: userId },
    });
    const users = await res.map(async (r) => {
      return await this.prisma.user.findUnique({
        where: { id: r.followingId },
      });
    });
    return users;
  }
  async findFollowers(userId: string) {
    console.log(userId);
    const res = await this.prisma.follow.findMany({
      where: { followingId: userId },
    });
    const users = await res.map(async (r) => {
      return await this.prisma.user.findUnique({
        where: { id: r.followedById },
      });
    });
    return users;
  }

  async followUser(followId: string, relationship: string, userId: string) {
    const follow = await this.prisma.follow.upsert({
      where: {
        followingId_followedById: {
          followedById: userId,
          followingId: followId,
        },
      },
      update: {
        relationship,
      },
      create: {
        followedById: userId,
        followingId: followId,
        relationship,
      },
    });
    console.log(follow);
    return {
      following: follow.followingId,
      relationship: follow.relationship,
    };
  }

  remove() {
    return `This action removeuser`;
  }
}
