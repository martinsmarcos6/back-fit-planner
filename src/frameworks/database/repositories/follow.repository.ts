import { Injectable } from "@nestjs/common";
import { Follow } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class FollowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(follow: Follow): Promise<Follow> {
    const createdFollow = await this.prisma.follow.create({
      data: {
        id: follow.id,
        followerId: follow.followerId,
        followingId: follow.followingId,
        createdAt: follow.createdAt,
      },
    });

    return new Follow({
      id: createdFollow.id,
      followerId: createdFollow.followerId,
      followingId: createdFollow.followingId,
      createdAt: createdFollow.createdAt,
    });
  }

  async findByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<Follow | null> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) return null;

    return new Follow({
      id: follow.id,
      followerId: follow.followerId,
      followingId: follow.followingId,
      createdAt: follow.createdAt,
    });
  }

  async delete(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async countFollowers(userId: string): Promise<number> {
    return this.prisma.follow.count({
      where: {
        followingId: userId,
      },
    });
  }

  async countFollowing(userId: string): Promise<number> {
    return this.prisma.follow.count({
      where: {
        followerId: userId,
      },
    });
  }

  async findFollowers(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    followers: Array<{
      id: string;
      username: string;
      name: string;
      avatar: string | null;
      isFollowedByCurrentUser: boolean;
    }>;
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: {
          followingId: userId,
        },
        include: {
          follower: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.follow.count({
        where: {
          followingId: userId,
        },
      }),
    ]);

    const followers = follows.map((follow) => ({
      id: follow.follower.id,
      username: follow.follower.profile?.username || "",
      name: follow.follower.profile?.name || "",
      avatar: follow.follower.profile?.avatar || null,
      isFollowedByCurrentUser: false, // Será preenchido pelo use case
    }));

    return { followers, total };
  }

  async findFollowing(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    following: Array<{
      id: string;
      username: string;
      name: string;
      avatar: string | null;
    }>;
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [follows, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: {
          followerId: userId,
        },
        include: {
          following: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.follow.count({
        where: {
          followerId: userId,
        },
      }),
    ]);

    const following = follows.map((follow) => ({
      id: follow.following.id,
      username: follow.following.profile?.username || "",
      name: follow.following.profile?.name || "",
      avatar: follow.following.profile?.avatar || null,
    }));

    return { following, total };
  }

  async findFollowingIds(userId: string): Promise<string[]> {
    const follows = await this.prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    return follows.map((follow) => follow.followingId);
  }
}
