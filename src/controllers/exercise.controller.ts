import { Controller, Param, Post } from "@nestjs/common";
import { CreateExerciseDto, ExerciseResponseDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { CreateExerciseUseCase } from "../use-cases/exercise/create-exercise.use-case";

@Controller("workout-days/:dayId/exercises")
export class ExerciseController {
  constructor(private readonly createExerciseUseCase: CreateExerciseUseCase) {}

  @Post()
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
      name: exercise.name,
      sets: exercise.sets,
      repsRange: exercise.repsRange,
      weight: exercise.weight ?? undefined,
      restSeconds: exercise.restSeconds ?? undefined,
      order: exercise.order,
      notes: exercise.notes ?? undefined,
      workoutDayId: exercise.workoutDayId,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
