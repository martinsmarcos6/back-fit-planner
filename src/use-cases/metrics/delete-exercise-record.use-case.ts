import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ExerciseRecordRepository } from "../../frameworks/database/repositories/exercise-record.repository";

@Injectable()
export class DeleteExerciseRecordUseCase {
  constructor(
    private readonly exerciseRecordRepository: ExerciseRecordRepository,
  ) {}

  async execute(userId: string, recordId: string): Promise<void> {
    // Verificar se o registro existe e se o usuário é o dono
    const isOwner = await this.exerciseRecordRepository.isOwner(
      recordId,
      userId,
    );

    if (!isOwner) {
      const record = await this.exerciseRecordRepository.findById(recordId);
      if (!record) {
        throw new NotFoundException("Registro não encontrado");
      }
      throw new ForbiddenException(
        "Você não tem permissão para deletar este registro",
      );
    }

    await this.exerciseRecordRepository.delete(recordId);
  }
}
