import { Controller, Get, Param, Post } from "@nestjs/common";
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
import { GetExerciseByDayUseCase } from "../use-cases/exercise/get-exercise-by-day.use-case";
import { CreateWorkoutPlanDto, WorkoutPlanResponseDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { GetWorkoutDayUseCase } from "../use-cases/workout-day/get-workout-day.use-case";
import { CreateWorkoutPlanUseCase } from "../use-cases/workout-plan/create-workout-plan.use-case";
import { GetWorkoutPlanUseCase } from "../use-cases/workout-plan/get-workout-plan.use-case";

@ApiTags("workout-plans")
@ApiBearerAuth("JWT-auth")
@Controller("workout-plans")
export class WorkoutPlanController {
  constructor(
    private readonly createWorkoutPlanUseCase: CreateWorkoutPlanUseCase,
    private readonly getWorkoutPlanUseCase: GetWorkoutPlanUseCase,
    private readonly getWorkoutDayUseCase: GetWorkoutDayUseCase,
    private readonly getExerciseByDayUseCase: GetExerciseByDayUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Criar plano de treino",
    description: "Cria um novo plano de treino para o usuário autenticado",
  })
  @ApiBody({ type: CreateWorkoutPlanDto })
  @ApiResponse({
    status: 201,
    description: "Plano de treino criado com sucesso",
    type: WorkoutPlanResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiUnauthorizedResponse({ description: "Token de acesso inválido" })
  async createPlan(
    @CurrentUser() currentUser: CurrentUserPayload,
    @BodyDto(CreateWorkoutPlanDto) createPlanDto: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = await this.createWorkoutPlanUseCase.execute(
      currentUser.userId,
      createPlanDto,
    );

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description ?? undefined,
      isPublic: plan.isPublic,
      userId: plan.userId,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  @Get("me")
  @ApiOperation({
    summary: "Listar meus planos de treino",
    description: "Retorna todos os planos de treino do usuário autenticado",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de planos de treino retornada com sucesso",
    type: [WorkoutPlanResponseDto],
  })
  @ApiUnauthorizedResponse({ description: "Token de acesso inválido" })
  async getMyPlans(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<WorkoutPlanResponseDto[]> {
    const plans = await this.getWorkoutPlanUseCase.executeByUserId(
      currentUser.userId,
    );

    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description ?? undefined,
      isPublic: plan.isPublic,
      userId: plan.userId,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obter plano de treino por ID",
    description:
      "Retorna um plano de treino específico com seus dias e exercícios",
  })
  @ApiParam({
    name: "id",
    description: "ID do plano de treino",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Plano de treino retornado com sucesso",
    type: WorkoutPlanResponseDto,
  })
  @ApiNotFoundResponse({ description: "Plano de treino não encontrado" })
  @ApiUnauthorizedResponse({ description: "Token de acesso inválido" })
  async getPlanById(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("id") id: string,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = await this.getWorkoutPlanUseCase.executeWithOwnershipCheck(
      id,
      currentUser.userId,
    );

    const days = await this.getWorkoutDayUseCase.executeByPlanId(plan.id);

    const daysWithExercises = await Promise.all(
      days.map(async (day) => ({
        ...day,
        exercises: await this.getExerciseByDayUseCase.executeByWorkoutDayId(
          day.id,
        ),
      })),
    );

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description ?? undefined,
      isPublic: plan.isPublic,
      userId: plan.userId,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      days: daysWithExercises.map((day) => ({
        id: day.id,
        dayOfWeek: day.dayOfWeek,
        workoutName: day.workoutName,
        workoutPlanId: day.workoutPlanId,
        description: day.description ?? undefined,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
        exercises: day.exercises,
      })),
    };
  }
}
