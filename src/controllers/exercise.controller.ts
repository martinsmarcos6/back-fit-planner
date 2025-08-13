import { Controller, Param, Post } from "@nestjs/common";
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
} from "@nestjs/swagger";
import { CreateExerciseDto, ExerciseResponseDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { CreateExerciseUseCase } from "../use-cases/exercise/create-exercise.use-case";

@ApiTags("exercises")
@ApiBearerAuth("JWT-auth")
@Controller("workout-days/:dayId/exercises")
export class ExerciseController {
  constructor(private readonly createExerciseUseCase: CreateExerciseUseCase) {}

  @Post()
  @ApiOperation({
    summary: "Adicionar exercício existente",
    description:
      "Seleciona um exercício do catálogo e adiciona ao dia de treino específico",
  })
  @ApiParam({
    name: "dayId",
    description: "ID do dia de treino",
    type: String,
  })
  @ApiBody({ type: CreateExerciseDto })
  @ApiResponse({
    status: 201,
    description: "Exercício criado com sucesso",
    type: ExerciseResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiNotFoundResponse({ description: "Dia de treino não encontrado" })
  @ApiUnauthorizedResponse({ description: "Token de acesso inválido" })
  async createExercise(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("dayId") dayId: string,
    @BodyDto(CreateExerciseDto) createExerciseDto: CreateExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.createExerciseUseCase.execute(
      dayId,
      currentUser.userId,
      createExerciseDto,
    );

    return {
      id: exercise.id,
      catalogId: exercise.catalogId,
      name: exercise.name,
      sets: exercise.sets,
      repsRange: exercise.repsRange,
      restSeconds: exercise.restSeconds ?? undefined,
      order: exercise.order,
      notes: exercise.notes ?? undefined,
      workoutDayId: exercise.workoutDayId,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
