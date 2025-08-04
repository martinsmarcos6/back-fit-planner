import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkoutPlan } from "../../core/entities";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class GetWorkoutPlanUseCase {
  constructor(private readonly workoutPlanRepository: WorkoutPlanRepository) {}

  async executeByUserId(userId: string): Promise<WorkoutPlan[]> {
    return this.workoutPlanRepository.findByUserId(userId);
  }

  async executeById(id: string): Promise<WorkoutPlan | null> {
    return this.workoutPlanRepository.findById(id);
  }

  async executeWithOwnershipCheck(
    planId: string,
    userId: string,
  ): Promise<WorkoutPlan> {
    const plan = await this.workoutPlanRepository.findById(planId);

    if (!plan) {
      throw new NotFoundException("Plano de treino não encontrado");
    }

    // Verificar se o usuário é o dono ou se o plano é público
    if (plan.userId !== userId && !plan.isPublic) {
      throw new NotFoundException("Plano de treino não encontrado");
    }

    return plan;
  }
}
