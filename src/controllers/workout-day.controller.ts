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
import { CreateWorkoutDayDto, WorkoutDayResponseDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { CreateWorkoutDayUseCase } from "../use-cases/workout-day/create-workout-day.use-case";

@ApiTags("workout-days")
@ApiBearerAuth("JWT-auth")
@Controller("workout-plans/:planId/days")
export class WorkoutDayController {
  constructor(
    private readonly createWorkoutDayUseCase: CreateWorkoutDayUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Criar dia de treino",
    description: "Adiciona um novo dia de treino a um plano específico",
  })
  @ApiParam({
    name: "planId",
    description: "ID do plano de treino",
    type: String,
  })
  @ApiBody({ type: CreateWorkoutDayDto })
  @ApiResponse({
    status: 201,
    description: "Dia de treino criado com sucesso",
    type: WorkoutDayResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiNotFoundResponse({ description: "Plano de treino não encontrado" })
  @ApiUnauthorizedResponse({ description: "Token de acesso inválido" })
  async createDay(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("planId") planId: string,
    @BodyDto(CreateWorkoutDayDto) createDayDto: CreateWorkoutDayDto,
  ): Promise<WorkoutDayResponseDto> {
    const day = await this.createWorkoutDayUseCase.execute(
      planId,
      currentUser.userId,
      createDayDto,
    );

    return {
      id: day.id,
      dayOfWeek: day.dayOfWeek,
      workoutName: day.workoutName,
      description: day.description ?? undefined,
      workoutPlanId: day.workoutPlanId,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }
}
