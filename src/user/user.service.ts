import { User, UserRelationship } from '../graphql';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
  async findOne(userId: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findFollows(userId: string) {
    const res = await this.prisma.follow.findMany({
      where: { followedById: userId },
    });
    const users = await res.map(async (r) => {
      const { id, userName, email, dateJoined, lastEdited } =
        await this.prisma.user.findUnique({
          where: { id: r.followingId },
        });
      return {
        id,
        userName,
        email,
        dateJoined,
        lastEdited,
        followedBy: r.relationship,
      };
    });
    return users;
  }
  async findFollowers(userId: string) {
    const res = await this.prisma.follow.findMany({
      where: { followingId: userId, relationship: { not: 'Blocked' } },
    });
    const users = await res.map(async (r) => {
      console.log(r);
      const { id, userName, email, dateJoined, lastEdited } =
        await this.prisma.user.findUnique({
          where: { id: r.followedById },
        });
      return {
        id,
        userName,
        email,
        dateJoined,
        lastEdited,
        rfollowing: r.relationship,
      };
    });
    return [...users];
  }

  async getUserRelationships(userId: string): Promise<UserRelationship[]> {
    // Fetch all necessary data in one or more queries
    const [allUsers, relations] = await Promise.all([
      // Query for all users
      this.prisma.user.findMany(),
      // Query for the necessary relationships: followers, following, and blocked
      this.prisma.follow.findMany({
        where: {
          OR: [{ followedById: userId }, { followingId: userId }],
        },
        include: {
          followedBy: true,
          following: true,
        },
      }),
    ]);

    // Create sets for followers, following, and blocked users
    const followersSet = new Set<string>();
    const followingSet = new Set<string>();
    const blockedSet = new Set<string>();

    // Process relations to populate the sets
    for (const relation of relations) {
      if (relation.followedById === userId) {
        // User is being followed
        if (relation.following) {
          followersSet.add(relation.following.id);
        }
      }
      if (relation.followingId === userId) {
        // User is following someone
        if (relation.followedBy) {
          followingSet.add(relation.followedBy.id);
        }
      }
      if (
        (relation.followingId === userId || relation.followedById === userId) &&
        relation.relationship === 'Blocked'
      ) {
        // User is blocked
        if (relation.following) {
          blockedSet.add(relation.following.id);
        }
        if (relation.followedBy) {
          blockedSet.add(relation.followedBy.id);
        }
      }
    }

    // Process allUsers and filter out blocked users
    const result: UserRelationship[] = [];

    for (const user of allUsers) {
      const userId = user.id;
      // Skip blocked users
      if (blockedSet.has(userId)) {
        continue;
      }

      // Determine the user's relationship to the current user
      const isFollowing = followingSet.has(userId);
      const isFollowedBy = followersSet.has(userId);

      // Create an object with the user and their relationship status
      const userRelationship: UserRelationship = {
        user,
        following: isFollowing,
        followedBy: isFollowedBy,
      };

      // Add the userRelationship object to the result array
      result.push(userRelationship);
    }

    // Return the list of user relationships
    return result;
  }

  async followUser(followId: string, relationship: string, userId: string) {
    const isBlocked = await this.checkBlock(userId, followId);
    if (isBlocked) {
      return { message: "I can't let you do that, dave" };
    }
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
      select: {
        relationship: true,
        following: {
          select: {
            userName: true,
          },
        },
      },
    });
    console.log(follow);
    return {
      message: `You've marked your relationship with ${follow.following.userName} as ${follow.relationship}`,
    };
  }

  async unfollowUser(unfollowId: string, userId: string) {
    const isFollowing = await this.prisma.follow.findUnique({
      where: {
        followingId_followedById: {
          followedById: userId,
          followingId: unfollowId,
        },
      },
    });
    if (!isFollowing) {
      return { message: 'You are not following boop' };
    }
    const un = await this.prisma.follow.delete({
      where: {
        followingId_followedById: {
          followedById: userId,
          followingId: unfollowId,
        },
      },
    });
    console.log(un);
    return un;
  }

  async blockUser(blockId: string, userId: string) {
    const u = await this.prisma.blockedUser.create({
      data: {
        userId: blockId,
        blockingUserId: userId,
      },
      select: {
        user: {
          select: {
            userName: true,
          },
        },
      },
    });
    await this.unfollowUser(blockId, userId);
    await this.unfollowUser(userId, blockId);
    console.log(u.user.userName);
    return {
      message: `User ${u.user.userName} has been blocked, you will no longer be able to interact with eachother`,
    };
  }

  async unblockUser(unblockId: string, userId: string) {
    const u = await this.prisma.blockedUser.delete({
      where: {
        userId_blockingUserId: {
          blockingUserId: userId,
          userId: unblockId,
        },
      },
      select: {
        user: {
          select: {
            userName: true,
          },
        },
      },
    });
    console.log(u.user.userName);
    return { message: `User ${u.user.userName} is no longer blocked` };
  }

  async checkBlock(id1: string, id2: string): Promise<boolean> {
    const isBlocked = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          {
            userId: id1,
            blockingUserId: id2,
          },
          {
            userId: id2,
            blockingUserId: id1,
          },
        ],
      },
    });
    if (isBlocked) {
      return true;
    }
    return false;
  }
}
