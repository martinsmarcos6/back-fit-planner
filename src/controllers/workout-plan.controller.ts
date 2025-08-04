import { Controller, Get, Post, Param } from "@nestjs/common";
import { CreateWorkoutPlanDto, WorkoutPlanResponseDto } from "../core/dtos";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import { CreateWorkoutPlanUseCase } from "../use-cases/workout-plan/create-workout-plan.use-case";
import { GetWorkoutPlanUseCase } from "../use-cases/workout-plan/get-workout-plan.use-case";
import { GetWorkoutDayUseCase } from "../use-cases/workout-day/get-workout-day.use-case";

@Controller("workout-plans")
export class WorkoutPlanController {
  constructor(
    private readonly createWorkoutPlanUseCase: CreateWorkoutPlanUseCase,
    private readonly getWorkoutPlanUseCase: GetWorkoutPlanUseCase,
    private readonly getWorkoutDayUseCase: GetWorkoutDayUseCase,
  ) {}

  @Post()
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
  async getPlanById(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("id") id: string,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = await this.getWorkoutPlanUseCase.executeWithOwnershipCheck(
      id,
      currentUser.userId,
    );

    const days = await this.getWorkoutDayUseCase.executeByPlanId(plan.id);

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description ?? undefined,
      isPublic: plan.isPublic,
      userId: plan.userId,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      days: days.map((day) => ({
        id: day.id,
        dayOfWeek: day.dayOfWeek,
        workoutName: day.workoutName,
        workoutPlanId: day.workoutPlanId,
        description: day.description ?? undefined,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
      })),
    };
  }
}
