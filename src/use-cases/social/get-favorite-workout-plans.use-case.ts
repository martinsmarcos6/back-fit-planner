import { Injectable } from "@nestjs/common";
import { FavoriteRepository } from "../../frameworks/database/repositories/favorite.repository";

@Injectable()
export class GetFavoriteWorkoutPlansUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(
    userId: string,
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
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.favoriteRepository.findFavoriteWorkoutPlansByUser(
      userId,
      page,
      limit,
    );

    const totalPages = Math.ceil(result.total / limit);

    return {
      ...result,
      page,
      limit,
      totalPages,
    };
  }
}
