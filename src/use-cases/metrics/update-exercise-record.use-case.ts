import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ExerciseRecord } from "../../core/entities";
import { ExerciseRecordRepository } from "../../frameworks/database/repositories/exercise-record.repository";

@Injectable()
export class UpdateExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: ExerciseRecordRepository,
  ) {}

  async execute(
    userId: string,
    recordId: string,
    weight?: number,
    notes?: string,
  ): Promise<ExerciseRecord> {
    // Verificar se o registro existe
    const existingRecord =
      await this.exerciseRecordRepository.findById(recordId);
    if (!existingRecord) {
      throw new NotFoundException("Registro não encontrado");
    }

    // Verificar se o usuário é o dono do registro
    if (existingRecord.userId !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para atualizar este registro",
      );
    }

    // Atualizar o registro
    const updatedRecord = existingRecord.updateRecord({
      weight,
      notes,
    });

    return this.exerciseRecordRepository.update(updatedRecord);
  }
}
