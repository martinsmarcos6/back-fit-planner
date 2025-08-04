import { Injectable, NotFoundException } from "@nestjs/common";
import { ExerciseRecord } from "../../core/entities";
import { ExerciseRecordRepository } from "../../frameworks/database/repositories/exercise-record.repository";
import { ExerciseRepository } from "../../frameworks/database/repositories/exercise.repository";

@Injectable()
export class CreateExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: ExerciseRecordRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute(
    userId: string,
    exerciseId: string,
    weight: number,
    notes?: string,
  ): Promise<ExerciseRecord> {
    // Verificar se o exercício existe
    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new NotFoundException("Exercício não encontrado");
    }

    // Criar o registro
    const exerciseRecord = ExerciseRecord.create({
      userId,
      exerciseId,
      weight,
      notes,
    });

    return this.exerciseRecordRepository.create(exerciseRecord);
  }
}
