import { Injectable } from "@nestjs/common";
import { CreateWorkoutPlanDto } from "../../core/dtos";
import { WorkoutPlan } from "../../core/entities";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class CreateWorkoutPlanUseCase {
  constructor(private readonly workoutPlanRepository: WorkoutPlanRepository) {}

  async execute(
    userId: string,
    createPlanDto: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlan> {
    const plan = WorkoutPlan.create({
      name: createPlanDto.name,
      description: createPlanDto.description,
      userId,
      isPublic: createPlanDto.isPublic ?? false,
    });

    return this.workoutPlanRepository.create(plan);
  }
}
