import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import {
  FavoriteResponseDto,
  FollowResponseDto,
  LikeResponseDto,
  SocialStatsDto,
} from "../core/dtos";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { FavoriteWorkoutPlanUseCase } from "../use-cases/social/favorite-workout-plan.use-case";
import { FollowUserUseCase } from "../use-cases/social/follow-user.use-case";
import { GetFavoriteWorkoutPlansUseCase } from "../use-cases/social/get-favorite-workout-plans.use-case";
import { GetPublicFeedUseCase } from "../use-cases/social/get-public-feed.use-case";
import { GetSocialStatsUseCase } from "../use-cases/social/get-social-stats.use-case";
import { GetUserFollowersUseCase } from "../use-cases/social/get-user-followers.use-case";
import { GetUserFollowingUseCase } from "../use-cases/social/get-user-following.use-case";
import { LikeWorkoutPlanUseCase } from "../use-cases/social/like-workout-plan.use-case";
import { UnfavoriteWorkoutPlanUseCase } from "../use-cases/social/unfavorite-workout-plan.use-case";
import { UnfollowUserUseCase } from "../use-cases/social/unfollow-user.use-case";
import { UnlikeWorkoutPlanUseCase } from "../use-cases/social/unlike-workout-plan.use-case";

@Controller("social")
export class SocialController {
  constructor(
    private readonly likeWorkoutPlanUseCase: LikeWorkoutPlanUseCase,
    private readonly unlikeWorkoutPlanUseCase: UnlikeWorkoutPlanUseCase,
    private readonly favoriteWorkoutPlanUseCase: FavoriteWorkoutPlanUseCase,
    private readonly unfavoriteWorkoutPlanUseCase: UnfavoriteWorkoutPlanUseCase,
    private readonly getFavoriteWorkoutPlansUseCase: GetFavoriteWorkoutPlansUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getUserFollowersUseCase: GetUserFollowersUseCase,
    private readonly getUserFollowingUseCase: GetUserFollowingUseCase,
    private readonly getPublicFeedUseCase: GetPublicFeedUseCase,
    private readonly getSocialStatsUseCase: GetSocialStatsUseCase,
  ) {}

  // ==================== CURTIDAS ====================

  @Post("workout-plans/:planId/like")
  async likeWorkoutPlan(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("planId") planId: string,
  ): Promise<LikeResponseDto> {
    const like = await this.likeWorkoutPlanUseCase.execute(
      currentUser.userId,
      planId,
    );

    return {
      id: like.id,
      userId: like.userId,
      workoutPlanId: like.workoutPlanId,
      createdAt: like.createdAt,
    };
  }

  @Delete("workout-plans/:planId/like")
  async unlikeWorkoutPlan(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("planId") planId: string,
  ): Promise<{ message: string }> {
    await this.unlikeWorkoutPlanUseCase.execute(currentUser.userId, planId);
    return { message: "Curtida removida com sucesso" };
  }

  // ==================== FAVORITOS ====================

  @Post("workout-plans/:planId/favorite")
  async favoriteWorkoutPlan(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("planId") planId: string,
  ): Promise<FavoriteResponseDto> {
    const favorite = await this.favoriteWorkoutPlanUseCase.execute(
      currentUser.userId,
      planId,
    );

    return {
      id: favorite.id,
      userId: favorite.userId,
      workoutPlanId: favorite.workoutPlanId,
      createdAt: favorite.createdAt,
    };
  }

  @Delete("workout-plans/:planId/favorite")
  async unfavoriteWorkoutPlan(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("planId") planId: string,
  ): Promise<{ message: string }> {
    await this.unfavoriteWorkoutPlanUseCase.execute(currentUser.userId, planId);
    return { message: "Favorito removido com sucesso" };
  }

  @Get("favorites")
  async getFavoriteWorkoutPlans(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.getFavoriteWorkoutPlansUseCase.execute(
      currentUser.userId,
      pageNum,
      limitNum,
    );
  }

  // ==================== SEGUIR USUÁRIOS ====================

  @Post("users/:userId/follow")
  async followUser(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("userId") userId: string,
  ): Promise<FollowResponseDto> {
    const follow = await this.followUserUseCase.execute(
      currentUser.userId,
      userId,
    );

    return {
      id: follow.id,
      followerId: follow.followerId,
      followingId: follow.followingId,
      createdAt: follow.createdAt,
    };
  }

  @Delete("users/:userId/follow")
  async unfollowUser(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("userId") userId: string,
  ): Promise<{ message: string }> {
    await this.unfollowUserUseCase.execute(currentUser.userId, userId);
    return { message: "Usuário removido dos seguidos com sucesso" };
  }

  @Get("users/:userId/followers")
  async getUserFollowers(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param("userId") userId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.getUserFollowersUseCase.execute(
      userId,
      currentUser.userId,
      pageNum,
      limitNum,
    );
  }

  @Get("users/:userId/following")
  async getUserFollowing(
    @CurrentUser() _currentUser: CurrentUserPayload,
    @Param("userId") userId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.getUserFollowingUseCase.execute(userId, pageNum, limitNum);
  }

  // ==================== FEED PÚBLICO ====================

  @Get("feed")
  async getPublicFeed(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    return this.getPublicFeedUseCase.execute(
      currentUser.userId,
      pageNum,
      limitNum,
    );
  }

  // ==================== ESTATÍSTICAS SOCIAIS ====================

  @Get("stats/:userId")
  async getSocialStats(
    @Param("userId") userId: string,
  ): Promise<SocialStatsDto> {
    return this.getSocialStatsUseCase.execute(userId);
  }

  @Get("stats")
  async getCurrentUserSocialStats(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<SocialStatsDto> {
    return this.getSocialStatsUseCase.execute(currentUser.userId);
  }
}
