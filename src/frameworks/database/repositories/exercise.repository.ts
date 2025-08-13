import { Injectable } from "@nestjs/common";
import { Exercise } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) return null;

    return new Exercise({
      id: exercise.id,
      workoutDayId: exercise.workoutDayId,
      catalogId: exercise.catalogId as string,
      name: exercise.name,
      sets: exercise.sets,
      repsRange: exercise.repsRange,
      restSeconds: exercise.restSeconds,
      order: exercise.order,
      notes: exercise.notes,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    });
  }

  async findByWorkoutDayId(workoutDayId: string): Promise<Exercise[]> {
    const exercises = await this.prisma.exercise.findMany({
      where: { workoutDayId },
      orderBy: { order: "asc" },
    });

    return exercises.map(
      (exercise) =>
        new Exercise({
          id: exercise.id,
          workoutDayId: exercise.workoutDayId,
          catalogId: exercise.catalogId as string,
          name: exercise.name,
          sets: exercise.sets,
          repsRange: exercise.repsRange,
          restSeconds: exercise.restSeconds,
          order: exercise.order,
          notes: exercise.notes,
          createdAt: exercise.createdAt,
          updatedAt: exercise.updatedAt,
        }),
    );
  }

  async create(exercise: Exercise): Promise<Exercise> {
    const created = await this.prisma.exercise.create({
      data: {
        id: exercise.id,
        workoutDayId: exercise.workoutDayId,
        catalogId: exercise.catalogId,
        name: exercise.name,
        sets: exercise.sets,
        repsRange: exercise.repsRange,
        restSeconds: exercise.restSeconds,
        order: exercise.order,
        notes: exercise.notes,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
      },
    });

    return new Exercise({
      id: created.id,
      workoutDayId: created.workoutDayId,
      catalogId: created.catalogId as string,
      name: created.name,
      sets: created.sets,
      repsRange: created.repsRange,
      restSeconds: created.restSeconds,
      order: created.order,
      notes: created.notes,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  async createMany(exercises: Exercise[]): Promise<void> {
    await this.prisma.exercise.createMany({
      data: exercises.map((exercise) => ({
        id: exercise.id,
        workoutDayId: exercise.workoutDayId,
        catalogId: exercise.catalogId,
        name: exercise.name,
        sets: exercise.sets,
        repsRange: exercise.repsRange,
        restSeconds: exercise.restSeconds,
        order: exercise.order,
        notes: exercise.notes,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
      })),
    });
  }

  async update(id: string, exercise: Exercise): Promise<Exercise> {
    const updated = await this.prisma.exercise.update({
      where: { id },
      data: {
        name: exercise.name,
        sets: exercise.sets,
        repsRange: exercise.repsRange,
        restSeconds: exercise.restSeconds,
        order: exercise.order,
        notes: exercise.notes,
        updatedAt: exercise.updatedAt,
      },
    });

    return new Exercise({
      id: updated.id,
      workoutDayId: updated.workoutDayId,
      catalogId: updated.catalogId as string,
      name: updated.name,
      sets: updated.sets,
      repsRange: updated.repsRange,
      restSeconds: updated.restSeconds,
      order: updated.order,
      notes: updated.notes,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exercise.delete({
      where: { id },
    });
  }

  async deleteByWorkoutDayId(workoutDayId: string): Promise<void> {
    await this.prisma.exercise.deleteMany({
      where: { workoutDayId },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.exercise.count({
      where: { id },
    });
    return count > 0;
  }

  async getNextOrder(workoutDayId: string): Promise<number> {
    const lastExercise = await this.prisma.exercise.findFirst({
      where: { workoutDayId },
      orderBy: { order: "desc" },
    });

    return lastExercise ? lastExercise.order + 1 : 1;
  }
}
