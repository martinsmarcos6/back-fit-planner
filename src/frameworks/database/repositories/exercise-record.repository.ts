import { Injectable } from "@nestjs/common";
import { ExerciseRecord } from "../../../core/entities";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ExerciseRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(exerciseRecord: ExerciseRecord): Promise<ExerciseRecord> {
    const createdRecord = await this.prisma.exerciseRecord.create({
      data: {
        id: exerciseRecord.id,
        userId: exerciseRecord.userId,
        exerciseId: exerciseRecord.exerciseId,
        weight: exerciseRecord.weight,
        notes: exerciseRecord.notes,
        createdAt: exerciseRecord.createdAt,
        updatedAt: exerciseRecord.updatedAt,
      },
    });

    return new ExerciseRecord({
      id: createdRecord.id,
      userId: createdRecord.userId,
      exerciseId: createdRecord.exerciseId,
      weight: createdRecord.weight,
      notes: createdRecord.notes,
      createdAt: createdRecord.createdAt,
      updatedAt: createdRecord.updatedAt,
    });
  }

  async findById(id: string): Promise<ExerciseRecord | null> {
    const record = await this.prisma.exerciseRecord.findUnique({
      where: { id },
    });

    if (!record) return null;

    return new ExerciseRecord({
      id: record.id,
      userId: record.userId,
      exerciseId: record.exerciseId,
      weight: record.weight,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async update(exerciseRecord: ExerciseRecord): Promise<ExerciseRecord> {
    const updatedRecord = await this.prisma.exerciseRecord.update({
      where: { id: exerciseRecord.id },
      data: {
        weight: exerciseRecord.weight,
        notes: exerciseRecord.notes,
        updatedAt: exerciseRecord.updatedAt,
      },
    });

    return new ExerciseRecord({
      id: updatedRecord.id,
      userId: updatedRecord.userId,
      exerciseId: updatedRecord.exerciseId,
      weight: updatedRecord.weight,
      notes: updatedRecord.notes,
      createdAt: updatedRecord.createdAt,
      updatedAt: updatedRecord.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exerciseRecord.delete({
      where: { id },
    });
  }

  async findByUserAndExercise(
    userId: string,
    exerciseId: string,
  ): Promise<
    Array<{
      id: string;
      userId: string;
      exerciseId: string;
      exerciseName: string;
      weight: number;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const records = await this.prisma.exerciseRecord.findMany({
      where: {
        userId,
        exerciseId,
      },
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return records.map((record) => ({
      id: record.id,
      userId: record.userId,
      exerciseId: record.exerciseId,
      exerciseName: record.exercise.name,
      weight: record.weight,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  }

  async findProgressByExercise(
    userId: string,
    exerciseId: string,
  ): Promise<{
    exerciseId: string;
    exerciseName: string;
    progress: Array<{
      id: string;
      weight: number;
      notes: string | null;
      date: Date;
    }>;
    currentWeight: number | null;
    maxWeight: number | null;
    totalRecords: number;
  }> {
    const records = await this.prisma.exerciseRecord.findMany({
      where: {
        userId,
        exerciseId,
      },
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (records.length === 0) {
      // Buscar o nome do exercício mesmo sem registros
      const exercise = await this.prisma.exercise.findUnique({
        where: { id: exerciseId },
      });

      return {
        exerciseId,
        exerciseName: exercise?.name || "Exercício não encontrado",
        progress: [],
        currentWeight: null,
        maxWeight: null,
        totalRecords: 0,
      };
    }

    const progress = records.map((record) => ({
      id: record.id,
      weight: record.weight,
      notes: record.notes,
      date: record.createdAt,
    }));

    const weights = records.map((record) => record.weight);
    const currentWeight = weights[0]; // Mais recente
    const maxWeight = Math.max(...weights);

    return {
      exerciseId,
      exerciseName: records[0].exercise.name,
      progress,
      currentWeight,
      maxWeight,
      totalRecords: records.length,
    };
  }

  async findByUserId(userId: string): Promise<
    Array<{
      exerciseId: string;
      exerciseName: string;
      latestWeight: number;
      latestDate: Date;
      recordCount: number;
    }>
  > {
    // Buscar o último registro de cada exercício para o usuário
    const latestRecords = await this.prisma.exerciseRecord.findMany({
      where: { userId },
      include: {
        exercise: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Agrupar por exercício e manter apenas o mais recente
    const groupedByExercise = new Map();

    for (const record of latestRecords) {
      if (!groupedByExercise.has(record.exerciseId)) {
        groupedByExercise.set(record.exerciseId, {
          exerciseId: record.exerciseId,
          exerciseName: record.exercise.name,
          latestWeight: record.weight,
          latestDate: record.createdAt,
          recordCount: 0,
        });
      }
    }

    // Contar registros por exercício
    const counts = await this.prisma.exerciseRecord.groupBy({
      by: ["exerciseId"],
      where: { userId },
      _count: {
        exerciseId: true,
      },
    });

    // Adicionar as contagens
    counts.forEach((count) => {
      const exercise = groupedByExercise.get(count.exerciseId);
      if (exercise) {
        exercise.recordCount = count._count.exerciseId;
      }
    });

    return Array.from(groupedByExercise.values());
  }

  async isOwner(recordId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.exerciseRecord.count({
      where: { id: recordId, userId },
    });
    return count > 0;
  }
}
