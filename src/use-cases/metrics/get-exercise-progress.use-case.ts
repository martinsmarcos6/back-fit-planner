import { Injectable } from "@nestjs/common";
import { ExerciseRecordRepository } from "../../frameworks/database/repositories/exercise-record.repository";

@Injectable()
export class GetExerciseProgressUseCase {
  constructor(
    private readonly exerciseRecordRepository: ExerciseRecordRepository,
  ) {}

  async execute(
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
    return this.exerciseRecordRepository.findProgressByExercise(
      userId,
      exerciseId,
    );
  }
}
