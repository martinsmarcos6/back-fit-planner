import { Injectable } from "@nestjs/common";
import { Favorite } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class FavoriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(favorite: Favorite): Promise<Favorite> {
    const createdFavorite = await this.prisma.favorite.create({
      data: {
        id: favorite.id,
        userId: favorite.userId,
        workoutPlanId: favorite.workoutPlanId,
        createdAt: favorite.createdAt,
      },
    });

    return new Favorite({
      id: createdFavorite.id,
      userId: createdFavorite.userId,
      workoutPlanId: createdFavorite.workoutPlanId,
      createdAt: createdFavorite.createdAt,
    });
  }

  async findByUserAndWorkoutPlan(
    userId: string,
    workoutPlanId: string,
  ): Promise<Favorite | null> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_workoutPlanId: {
          userId,
          workoutPlanId,
        },
      },
    });

    if (!favorite) return null;

    return new Favorite({
      id: favorite.id,
      userId: favorite.userId,
      workoutPlanId: favorite.workoutPlanId,
      createdAt: favorite.createdAt,
    });
  }

  async delete(userId: string, workoutPlanId: string): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        userId_workoutPlanId: {
          userId,
          workoutPlanId,
        },
      },
    });
  }

  async findFavoriteWorkoutPlansByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    workoutPlans: Array<{
      id: string;
      name: string;
      description: string | null;
      isPublic: boolean;
      userId: string;
      author: {
        id: string;
        username: string;
        name: string;
        avatar: string | null;
      };
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: {
          userId,
        },
        include: {
          workoutPlan: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.favorite.count({
        where: {
          userId,
        },
      }),
    ]);

    const workoutPlans = favorites.map((favorite) => ({
      id: favorite.workoutPlan.id,
      name: favorite.workoutPlan.name,
      description: favorite.workoutPlan.description,
      isPublic: favorite.workoutPlan.isPublic,
      userId: favorite.workoutPlan.userId,
      author: {
        id: favorite.workoutPlan.user.id,
        username: favorite.workoutPlan.user.profile?.username || "",
        name: favorite.workoutPlan.user.profile?.name || "",
        avatar: favorite.workoutPlan.user.profile?.avatar || null,
      },
      createdAt: favorite.workoutPlan.createdAt,
      updatedAt: favorite.workoutPlan.updatedAt,
    }));

    return { workoutPlans, total };
  }

  async findFavoritedWorkoutPlansByUser(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
      },
      select: {
        workoutPlanId: true,
      },
    });

    return favorites.map((favorite) => favorite.workoutPlanId);
  }
}
