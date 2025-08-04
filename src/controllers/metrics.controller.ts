import { Controller, Post, Put, Get, Delete, Param } from "@nestjs/common";
import {
  CreateExerciseRecordDto,
  UpdateExerciseRecordDto,
  ExerciseRecordResponseDto,
  ExerciseProgressResponseDto,
} from "../core/dtos";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import { CreateExerciseRecordUseCase } from "../use-cases/metrics/create-exercise-record.use-case";
import { UpdateExerciseRecordUseCase } from "../use-cases/metrics/update-exercise-record.use-case";
import { GetExerciseProgressUseCase } from "../use-cases/metrics/get-exercise-progress.use-case";
import { GetUserProgressSummaryUseCase } from "../use-cases/metrics/get-user-progress-summary.use-case";
import { DeleteExerciseRecordUseCase } from "../use-cases/metrics/delete-exercise-record.use-case";

@Controller("metrics")
export class MetricsController {
  constructor(
    private readonly createExerciseRecordUseCase: CreateExerciseRecordUseCase,
    private readonly updateExerciseRecordUseCase: UpdateExerciseRecordUseCase,
    private readonly getExerciseProgressUseCase: GetExerciseProgressUseCase,
    private readonly getUserProgressSummaryUseCase: GetUserProgressSummaryUseCase,
    private readonly deleteExerciseRecordUseCase: DeleteExerciseRecordUseCase,
  ) {}

  // ==================== REGISTROS DE PESO ====================

  @Post("records")
  async createExerciseRecord(
    @CurrentUser() currentUser: CurrentUserPayload,
    @BodyDto(CreateExerciseRecordDto) createRecordDto: CreateExerciseRecordDto,
  ): Promise<ExerciseRecordResponseDto> {
    const record = await this.createExerciseRecordUseCase.execute(
      currentUser.userId,
      createRecordDto.exerciseId,
      createRecordDto.weight,
      createRecordDto.notes,
    );

    // Buscar o nome do exercício para a resposta
    const progress = await this.getExerciseProgressUseCase.execute(
      currentUser.userId,
      createRecordDto.exerciseId,
    );

    return {
      id: record.id,
      userId: record.userId,
      exerciseId: record.exerciseId,
      exerciseName: progress.exerciseName,
      weight: record.weight,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  @Put("records/:recordId")
  async updateExerciseRecord(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("recordId") recordId: string,
    @BodyDto(UpdateExerciseRecordDto) updateRecordDto: UpdateExerciseRecordDto,
  ): Promise<ExerciseRecordResponseDto> {
    const record = await this.updateExerciseRecordUseCase.execute(
      currentUser.userId,
      recordId,
      updateRecordDto.weight,
      updateRecordDto.notes,
    );

    // Buscar o nome do exercício para a resposta
    const progress = await this.getExerciseProgressUseCase.execute(
      currentUser.userId,
      record.exerciseId,
    );

    return {
      id: record.id,
      userId: record.userId,
      exerciseId: record.exerciseId,
      exerciseName: progress.exerciseName,
      weight: record.weight,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  @Delete("records/:recordId")
  async deleteExerciseRecord(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("recordId") recordId: string,
  ): Promise<{ message: string }> {
    await this.deleteExerciseRecordUseCase.execute(
      currentUser.userId,
      recordId,
    );
    return { message: "Registro deletado com sucesso" };
  }

  // ==================== PROGRESSÃO E HISTÓRICO ====================

  @Get("exercises/:exerciseId/progress")
  async getExerciseProgress(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("exerciseId") exerciseId: string,
  ): Promise<ExerciseProgressResponseDto> {
    return this.getExerciseProgressUseCase.execute(
      currentUser.userId,
      exerciseId,
    );
  }

  @Get("summary")
  async getUserProgressSummary(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<
    Array<{
      exerciseId: string;
      exerciseName: string;
      latestWeight: number;
      latestDate: Date;
      recordCount: number;
    }>
  > {
    return this.getUserProgressSummaryUseCase.execute(currentUser.userId);
  }
}
