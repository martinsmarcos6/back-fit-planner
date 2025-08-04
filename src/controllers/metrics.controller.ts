import { Controller, Post, Put, Get, Delete, Param } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
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

@ApiTags("metrics")
@ApiBearerAuth("JWT-auth")
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
  @ApiOperation({
    summary: "Registrar peso de exercício",
    description: "Cria um novo registro de peso para um exercício específico",
  })
  @ApiBody({ type: CreateExerciseRecordDto })
  @ApiResponse({
    status: 201,
    description: "Registro criado com sucesso",
    type: ExerciseRecordResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiNotFoundResponse({ description: "Exercício não encontrado" })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
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
  @ApiOperation({
    summary: "Atualizar registro de peso",
    description: "Atualiza um registro de peso existente",
  })
  @ApiParam({
    name: "recordId",
    description: "ID do registro a ser atualizado",
  })
  @ApiBody({ type: UpdateExerciseRecordDto })
  @ApiResponse({
    status: 200,
    description: "Registro atualizado com sucesso",
    type: ExerciseRecordResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiNotFoundResponse({ description: "Registro não encontrado" })
  @ApiForbiddenResponse({
    description: "Sem permissão para atualizar este registro",
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
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
  @ApiOperation({
    summary: "Deletar registro de peso",
    description: "Remove um registro de peso existente",
  })
  @ApiParam({ name: "recordId", description: "ID do registro a ser deletado" })
  @ApiResponse({
    status: 200,
    description: "Registro deletado com sucesso",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Registro deletado com sucesso" },
      },
    },
  })
  @ApiNotFoundResponse({ description: "Registro não encontrado" })
  @ApiForbiddenResponse({
    description: "Sem permissão para deletar este registro",
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
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
  @ApiOperation({
    summary: "Obter progressão de exercício",
    description:
      "Retorna o histórico completo de progresso de um exercício específico",
  })
  @ApiParam({ name: "exerciseId", description: "ID do exercício" })
  @ApiResponse({
    status: 200,
    description: "Progressão encontrada com sucesso",
    type: ExerciseProgressResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
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
  @ApiOperation({
    summary: "Obter resumo de progresso",
    description:
      "Retorna um resumo do progresso do usuário em todos os exercícios",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo encontrado com sucesso",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          exerciseId: { type: "string" },
          exerciseName: { type: "string" },
          latestWeight: { type: "number" },
          latestDate: { type: "string", format: "date-time" },
          recordCount: { type: "number" },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
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
