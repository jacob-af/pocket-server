import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private touchService: UserService,
  ) {}

  async getProfile(userId: string) {
    return await this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async updateProfile(userId: string, image: string) {
    console.log(image, 'image');
    return await this.prisma.profile.upsert({
      where: {
        userId,
      },
      update: {
        image,
      },
      create: {
        user: { connect: { id: userId } },
        image,
      },
    });
  }
}
