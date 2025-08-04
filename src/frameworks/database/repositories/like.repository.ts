import { Injectable } from "@nestjs/common";
import { Like } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(like: Like): Promise<Like> {
    const createdLike = await this.prisma.like.create({
      data: {
        id: like.id,
        userId: like.userId,
        workoutPlanId: like.workoutPlanId,
        createdAt: like.createdAt,
      },
    });

    return new Like({
      id: createdLike.id,
      userId: createdLike.userId,
      workoutPlanId: createdLike.workoutPlanId,
      createdAt: createdLike.createdAt,
    });
  }

  async findByUserAndWorkoutPlan(
    userId: string,
    workoutPlanId: string,
  ): Promise<Like | null> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_workoutPlanId: {
          userId,
          workoutPlanId,
        },
      },
    });

    if (!like) return null;

    return new Like({
      id: like.id,
      userId: like.userId,
      workoutPlanId: like.workoutPlanId,
      createdAt: like.createdAt,
    });
  }

  async delete(userId: string, workoutPlanId: string): Promise<void> {
    await this.prisma.like.delete({
      where: {
        userId_workoutPlanId: {
          userId,
          workoutPlanId,
        },
      },
    });
  }

  async countByWorkoutPlan(workoutPlanId: string): Promise<number> {
    return this.prisma.like.count({
      where: {
        workoutPlanId,
      },
    });
  }

  async findLikedWorkoutPlansByUser(userId: string): Promise<string[]> {
    const likes = await this.prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        workoutPlanId: true,
      },
    });

    return likes.map((like) => like.workoutPlanId);
  }
}
