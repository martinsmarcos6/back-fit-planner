import { Injectable } from "@nestjs/common";
import { ExerciseRecordRepository } from "../../frameworks/database/repositories/exercise-record.repository";

@Injectable()
export class GetUserProgressSummaryUseCase {
  constructor(
    private readonly exerciseRecordRepository: ExerciseRecordRepository,
  ) {}

  async execute(userId: string): Promise<
    Array<{
      exerciseId: string;
      exerciseName: string;
      latestWeight: number;
      latestDate: Date;
      recordCount: number;
    }>
  > {
    return this.exerciseRecordRepository.findByUserId(userId);
  }
}
