import { Injectable } from "@nestjs/common";
import { WorkoutPlan } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WorkoutPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkoutPlan | null> {
    const plan = await this.prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!plan) return null;

    return new WorkoutPlan({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      userId: plan.userId,
      isPublic: plan.isPublic,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<WorkoutPlan[]> {
    const plans = await this.prisma.workoutPlan.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return plans.map(
      (plan) =>
        new WorkoutPlan({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          userId: plan.userId,
          isPublic: plan.isPublic,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        }),
    );
  }

  async findPublicPlans(limit: number = 10): Promise<WorkoutPlan[]> {
    const plans = await this.prisma.workoutPlan.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return plans.map(
      (plan) =>
        new WorkoutPlan({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          userId: plan.userId,
          isPublic: plan.isPublic,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        }),
    );
  }

  async searchPlans(
    query: string,
    limit: number = 10,
    publicOnly: boolean = false,
  ): Promise<WorkoutPlan[]> {
    const plans = await this.prisma.workoutPlan.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          publicOnly ? { isPublic: true } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return plans.map(
      (plan) =>
        new WorkoutPlan({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          userId: plan.userId,
          isPublic: plan.isPublic,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        }),
    );
  }

  async create(plan: WorkoutPlan): Promise<WorkoutPlan> {
    const created = await this.prisma.workoutPlan.create({
      data: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        userId: plan.userId,
        isPublic: plan.isPublic,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      },
    });

    return new WorkoutPlan({
      id: created.id,
      name: created.name,
      description: created.description,
      userId: created.userId,
      isPublic: created.isPublic,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(id: string, plan: WorkoutPlan): Promise<WorkoutPlan> {
    const updated = await this.prisma.workoutPlan.update({
      where: { id },
      data: {
        name: plan.name,
        description: plan.description,
        isPublic: plan.isPublic,
        updatedAt: plan.updatedAt,
      },
    });

    return new WorkoutPlan({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      userId: updated.userId,
      isPublic: updated.isPublic,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workoutPlan.delete({
      where: { id },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.workoutPlan.count({
      where: { id },
    });
    return count > 0;
  }

  async isOwner(planId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.workoutPlan.count({
      where: { id: planId, userId },
    });
    return count > 0;
  }

  async findPublicWorkoutPlans(
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

    const [plans, total] = await Promise.all([
      this.prisma.workoutPlan.findMany({
        where: { isPublic: true },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.workoutPlan.count({
        where: { isPublic: true },
      }),
    ]);

    const workoutPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      isPublic: plan.isPublic,
      userId: plan.userId,
      author: {
        id: plan.user.id,
        username: plan.user.profile?.username || "",
        name: plan.user.profile?.name || "",
        avatar: plan.user.profile?.avatar || null,
      },
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));

    return { workoutPlans, total };
  }
}
