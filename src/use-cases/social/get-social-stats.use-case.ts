import { Injectable } from "@nestjs/common";
import { FollowRepository } from "../../frameworks/database/repositories/follow.repository";
import { LikeRepository } from "../../frameworks/database/repositories/like.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class GetSocialStatsUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
    private readonly likeRepository: LikeRepository,
  ) {}

  async execute(userId: string): Promise<{
    followersCount: number;
    followingCount: number;
    workoutPlansCount: number;
    totalLikesReceived: number;
  }> {
    const [followersCount, followingCount, userWorkoutPlans] =
      await Promise.all([
        this.followRepository.countFollowers(userId),
        this.followRepository.countFollowing(userId),
        this.workoutPlanRepository.findByUserId(userId),
      ]);

    // Contar total de curtidas recebidas em todos os planos do usuário
    const totalLikesReceived = await Promise.all(
      userWorkoutPlans.map((plan) =>
        this.likeRepository.countByWorkoutPlan(plan.id),
      ),
    ).then((likes) => likes.reduce((sum, count) => sum + count, 0));

    return {
      followersCount,
      followingCount,
      workoutPlansCount: userWorkoutPlans.length,
      totalLikesReceived,
    };
  }
}
