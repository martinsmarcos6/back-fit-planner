import { Injectable, NotFoundException } from "@nestjs/common";
import { FavoriteRepository } from "../../frameworks/database/repositories/favorite.repository";

@Injectable()
export class UnfavoriteWorkoutPlanUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(userId: string, workoutPlanId: string): Promise<void> {
    // Verificar se o favorito existe
    const existingFavorite =
      await this.favoriteRepository.findByUserAndWorkoutPlan(
        userId,
        workoutPlanId,
      );

    if (!existingFavorite) {
      throw new NotFoundException("Favorito não encontrado");
    }

    // Remover o favorito
    await this.favoriteRepository.delete(userId, workoutPlanId);
  }
}
