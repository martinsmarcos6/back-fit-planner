import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Favorite } from "../../core/entities";
import { FavoriteRepository } from "../../frameworks/database/repositories/favorite.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class FavoriteWorkoutPlanUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async execute(userId: string, workoutPlanId: string): Promise<Favorite> {
    // Verificar se o plano de treino existe
    const workoutPlan =
      await this.workoutPlanRepository.findById(workoutPlanId);
    if (!workoutPlan) {
      throw new NotFoundException("Plano de treino não encontrado");
    }

    // Verificar se o plano é público ou se o usuário é o dono
    if (!workoutPlan.isPublic && workoutPlan.userId !== userId) {
      throw new BadRequestException(
        "Não é possível favoritar planos privados de outros usuários",
      );
    }

    // Verificar se o usuário já favoritou este plano
    const existingFavorite =
      await this.favoriteRepository.findByUserAndWorkoutPlan(
        userId,
        workoutPlanId,
      );

    if (existingFavorite) {
      throw new BadRequestException(
        "Usuário já favoritou este plano de treino",
      );
    }

    // Criar o favorito
    const favorite = Favorite.create({
      userId,
      workoutPlanId,
    });

    return this.favoriteRepository.create(favorite);
  }
}
