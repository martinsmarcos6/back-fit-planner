import { Injectable } from "@nestjs/common";
import { type DayOfWeek, WorkoutDay } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WorkoutDayRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkoutDay | null> {
    const day = await this.prisma.workoutDay.findUnique({
      where: { id },
    });

    if (!day) return null;

    return new WorkoutDay({
      id: day.id,
      workoutPlanId: day.workoutPlanId,
      dayOfWeek: day.dayOfWeek as DayOfWeek,
      workoutName: day.workoutName,
      description: day.description,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    });
  }

  async findByPlanId(workoutPlanId: string): Promise<WorkoutDay[]> {
    const days = await this.prisma.workoutDay.findMany({
      where: { workoutPlanId },
      orderBy: [
        { dayOfWeek: "asc" }, // Ordenar por dia da semana
        { workoutName: "asc" },
      ],
    });

    return days.map(
      (day) =>
        new WorkoutDay({
          id: day.id,
          workoutPlanId: day.workoutPlanId,
          dayOfWeek: day.dayOfWeek as DayOfWeek,
          workoutName: day.workoutName,
          description: day.description,
          createdAt: day.createdAt,
          updatedAt: day.updatedAt,
        }),
    );
  }

  async findByPlanAndDay(
    workoutPlanId: string,
    dayOfWeek: DayOfWeek,
  ): Promise<WorkoutDay | null> {
    const day = await this.prisma.workoutDay.findUnique({
      where: {
        workoutPlanId_dayOfWeek: {
          workoutPlanId,
          dayOfWeek,
        },
      },
    });

    if (!day) return null;

    return new WorkoutDay({
      id: day.id,
      workoutPlanId: day.workoutPlanId,
      dayOfWeek: day.dayOfWeek as DayOfWeek,
      workoutName: day.workoutName,
      description: day.description,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    });
  }

  async create(day: WorkoutDay): Promise<WorkoutDay> {
    const created = await this.prisma.workoutDay.create({
      data: {
        id: day.id,
        workoutPlanId: day.workoutPlanId,
        dayOfWeek: day.dayOfWeek,
        workoutName: day.workoutName,
        description: day.description,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
      },
    });

    return new WorkoutDay({
      id: created.id,
      workoutPlanId: created.workoutPlanId,
      dayOfWeek: created.dayOfWeek as DayOfWeek,
      workoutName: created.workoutName,
      description: created.description,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async update(id: string, day: WorkoutDay): Promise<WorkoutDay> {
    const updated = await this.prisma.workoutDay.update({
      where: { id },
      data: {
        workoutName: day.workoutName,
        description: day.description,
        updatedAt: day.updatedAt,
      },
    });

    return new WorkoutDay({
      id: updated.id,
      workoutPlanId: updated.workoutPlanId,
      dayOfWeek: updated.dayOfWeek as DayOfWeek,
      workoutName: updated.workoutName,
      description: updated.description,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workoutDay.delete({
      where: { id },
    });
  }

  async deleteByPlanId(workoutPlanId: string): Promise<void> {
    await this.prisma.workoutDay.deleteMany({
      where: { workoutPlanId },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.workoutDay.count({
      where: { id },
    });
    return count > 0;
  }
}
