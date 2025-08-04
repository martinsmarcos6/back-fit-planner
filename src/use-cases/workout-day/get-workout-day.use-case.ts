import { Injectable } from "@nestjs/common";
import { WorkoutDay } from "../../core/entities";
import { WorkoutDayRepository } from "../../frameworks/database/repositories/workout-day.repository";

@Injectable()
export class GetWorkoutDayUseCase {
  constructor(private readonly workoutDayRepository: WorkoutDayRepository) {}

  async executeByPlanId(planId: string): Promise<WorkoutDay[]> {
    return this.workoutDayRepository.findByPlanId(planId);
  }
}
