import { Injectable } from "@nestjs/common";
import { FavoriteRepository } from "../../frameworks/database/repositories/favorite.repository";
import { LikeRepository } from "../../frameworks/database/repositories/like.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class GetPublicFeedUseCase {
  constructor(
    private readonly workoutPlanRepository: WorkoutPlanRepository,
    private readonly likeRepository: LikeRepository,
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async execute(
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    workoutPlans: Array<{
      id: string;
      name: string;
      description: string | null;
      isPublic: boolean;
      userId: string;
      author: {
        id: string;
        username: string;
        name: string;
        avatar: string | null;
      };
      likesCount: number;
      isLikedByCurrentUser: boolean;
      isFavoritedByCurrentUser: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Buscar planos públicos com paginação
    const result = await this.workoutPlanRepository.findPublicWorkoutPlans(
      page,
      limit,
    );

    // Buscar IDs dos planos curtidos e favoritados pelo usuário atual
    const [likedPlanIds, favoritedPlanIds] = await Promise.all([
      this.likeRepository.findLikedWorkoutPlansByUser(currentUserId),
      this.favoriteRepository.findFavoritedWorkoutPlansByUser(currentUserId),
    ]);

    // Buscar contagem de curtidas para cada plano
    const workoutPlansWithSocialData = await Promise.all(
      result.workoutPlans.map(async (plan) => {
        const likesCount = await this.likeRepository.countByWorkoutPlan(
          plan.id,
        );

        return {
          ...plan,
          likesCount,
          isLikedByCurrentUser: likedPlanIds.includes(plan.id),
          isFavoritedByCurrentUser: favoritedPlanIds.includes(plan.id),
        };
      }),
    );

    const totalPages = Math.ceil(result.total / limit);

    return {
      workoutPlans: workoutPlansWithSocialData,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
