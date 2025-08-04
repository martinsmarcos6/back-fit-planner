import { Controller, Param, Post } from "@nestjs/common";
import { CreateWorkoutDayDto, WorkoutDayResponseDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { CreateWorkoutDayUseCase } from "../use-cases/workout-day/create-workout-day.use-case";

@Controller("workout-plans/:planId/days")
export class WorkoutDayController {
  constructor(
    private readonly createWorkoutDayUseCase: CreateWorkoutDayUseCase,
  ) {}

  @Post()
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
