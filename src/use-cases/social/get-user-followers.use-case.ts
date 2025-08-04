import { Injectable } from "@nestjs/common";
import { FollowRepository } from "../../frameworks/database/repositories/follow.repository";

@Injectable()
export class GetUserFollowersUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(
    userId: string,
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    followers: Array<{
      id: string;
      username: string;
      name: string;
      avatar: string | null;
      isFollowedByCurrentUser: boolean;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.followRepository.findFollowers(
      userId,
      page,
      limit,
    );

    // Buscar os IDs dos usuários que o usuário atual está seguindo
    const currentUserFollowingIds =
      await this.followRepository.findFollowingIds(currentUserId);

    // Marcar quais seguidores o usuário atual também está seguindo
    const followersWithStatus = result.followers.map((follower) => ({
      ...follower,
      isFollowedByCurrentUser: currentUserFollowingIds.includes(follower.id),
    }));

    const totalPages = Math.ceil(result.total / limit);

    return {
      followers: followersWithStatus,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
