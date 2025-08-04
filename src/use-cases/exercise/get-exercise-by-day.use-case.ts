import { Injectable } from "@nestjs/common";
import { Exercise } from "../../core/entities";
import { ExerciseRepository } from "../../frameworks/database/repositories/exercise.repository";

@Injectable()
export class GetExerciseByDayUseCase {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async executeByWorkoutDayId(workoutDayId: string): Promise<Exercise[]> {
    return this.exerciseRepository.findByWorkoutDayId(workoutDayId);
  }
}
