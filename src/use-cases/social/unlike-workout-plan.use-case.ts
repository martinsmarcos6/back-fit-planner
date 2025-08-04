import { Injectable, NotFoundException } from "@nestjs/common";
import { LikeRepository } from "../../frameworks/database/repositories/like.repository";

@Injectable()
export class UnlikeWorkoutPlanUseCase {
  constructor(private readonly likeRepository: LikeRepository) {}

  async execute(userId: string, workoutPlanId: string): Promise<void> {
    // Verificar se a curtida existe
    const existingLike = await this.likeRepository.findByUserAndWorkoutPlan(
      userId,
      workoutPlanId,
    );

    if (!existingLike) {
      throw new NotFoundException("Curtida não encontrada");
    }

    // Remover a curtida
    await this.likeRepository.delete(userId, workoutPlanId);
  }
}
