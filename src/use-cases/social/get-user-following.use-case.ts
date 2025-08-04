import { Injectable } from "@nestjs/common";
import { FollowRepository } from "../../frameworks/database/repositories/follow.repository";

@Injectable()
export class GetUserFollowingUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    following: Array<{
      id: string;
      username: string;
      name: string;
      avatar: string | null;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.followRepository.findFollowing(
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
