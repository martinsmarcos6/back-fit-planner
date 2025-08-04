import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Like } from "../../core/entities";
import { LikeRepository } from "../../frameworks/database/repositories/like.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class LikeWorkoutPlanUseCase {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async execute(userId: string, workoutPlanId: string): Promise<Like> {
    // Verificar se o plano de treino existe
    const workoutPlan =
      await this.workoutPlanRepository.findById(workoutPlanId);
    if (!workoutPlan) {
      throw new NotFoundException("Plano de treino não encontrado");
    }

    // Verificar se o plano é público ou se o usuário é o dono
    if (!workoutPlan.isPublic && workoutPlan.userId !== userId) {
      throw new BadRequestException(
        "Não é possível curtir planos privados de outros usuários",
      );
    }

    // Verificar se o usuário não está tentando curtir o próprio plano
    if (workoutPlan.userId === userId) {
      throw new BadRequestException(
        "Não é possível curtir o próprio plano de treino",
      );
    }

    // Verificar se o usuário já curtiu este plano
    const existingLike = await this.likeRepository.findByUserAndWorkoutPlan(
      userId,
      workoutPlanId,
    );

    if (existingLike) {
      throw new BadRequestException("Usuário já curtiu este plano de treino");
    }

    // Criar a curtida
    const like = Like.create({
      userId,
      workoutPlanId,
    });

    return this.likeRepository.create(like);
  }
}
