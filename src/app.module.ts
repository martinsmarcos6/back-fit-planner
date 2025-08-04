import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

// Configuration
import { appConfig, jwtConfig } from "./configuration";

// Controllers
import {
  AuthController,
  ExerciseController,
  ProfileController,
  SocialController,
  WorkoutDayController,
  WorkoutPlanController,
} from "./controllers";
import { JwtStrategy } from "./frameworks/auth/jwt.strategy";
import { JwtAuthGuard } from "./frameworks/auth/jwt-auth.guard";
// Frameworks
import { PrismaService } from "./frameworks/database/prisma.service";
import { ExerciseRepository } from "./frameworks/database/repositories/exercise.repository";
import { FavoriteRepository } from "./frameworks/database/repositories/favorite.repository";
import { FollowRepository } from "./frameworks/database/repositories/follow.repository";
import { LikeRepository } from "./frameworks/database/repositories/like.repository";
import { ProfileRepository } from "./frameworks/database/repositories/profile.repository";
import { UserRepository } from "./frameworks/database/repositories/user.repository";
import { WorkoutDayRepository } from "./frameworks/database/repositories/workout-day.repository";
import { WorkoutPlanRepository } from "./frameworks/database/repositories/workout-plan.repository";
// Services
import { AuthService, ProfileService } from "./services";
import { LoginUseCase } from "./use-cases/auth/login.use-case";
// Use Cases
import { RegisterUseCase } from "./use-cases/auth/register.use-case";
import { CreateExerciseUseCase } from "./use-cases/exercise/create-exercise.use-case";
import { GetExerciseByDayUseCase } from "./use-cases/exercise/get-exercise-by-day.use-case";
import { GetProfileUseCase } from "./use-cases/profile/get-profile.use-case";
import { SearchProfilesUseCase } from "./use-cases/profile/search-profiles.use-case";
import { UpdateProfileUseCase } from "./use-cases/profile/update-profile.use-case";
import { FavoriteWorkoutPlanUseCase } from "./use-cases/social/favorite-workout-plan.use-case";
import { FollowUserUseCase } from "./use-cases/social/follow-user.use-case";
import { GetFavoriteWorkoutPlansUseCase } from "./use-cases/social/get-favorite-workout-plans.use-case";
import { GetPublicFeedUseCase } from "./use-cases/social/get-public-feed.use-case";
import { GetSocialStatsUseCase } from "./use-cases/social/get-social-stats.use-case";
import { GetUserFollowersUseCase } from "./use-cases/social/get-user-followers.use-case";
import { GetUserFollowingUseCase } from "./use-cases/social/get-user-following.use-case";
import { LikeWorkoutPlanUseCase } from "./use-cases/social/like-workout-plan.use-case";
import { UnfavoriteWorkoutPlanUseCase } from "./use-cases/social/unfavorite-workout-plan.use-case";
import { UnfollowUserUseCase } from "./use-cases/social/unfollow-user.use-case";
import { UnlikeWorkoutPlanUseCase } from "./use-cases/social/unlike-workout-plan.use-case";
import { CreateWorkoutDayUseCase } from "./use-cases/workout-day/create-workout-day.use-case";
import { GetWorkoutDayUseCase } from "./use-cases/workout-day/get-workout-day.use-case";
import { CreateWorkoutPlanUseCase } from "./use-cases/workout-plan/create-workout-plan.use-case";
import { GetWorkoutPlanUseCase } from "./use-cases/workout-plan/get-workout-plan.use-case";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    ExerciseController,
    ProfileController,
    SocialController,
    WorkoutDayController,
    WorkoutPlanController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Services
    AuthService,
    ProfileService,

    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    SearchProfilesUseCase,
    CreateWorkoutPlanUseCase,
    GetWorkoutPlanUseCase,
    CreateWorkoutDayUseCase,
    CreateExerciseUseCase,
    GetWorkoutDayUseCase,
    GetExerciseByDayUseCase,

    // Social Use Cases
    LikeWorkoutPlanUseCase,
    UnlikeWorkoutPlanUseCase,
    FavoriteWorkoutPlanUseCase,
    UnfavoriteWorkoutPlanUseCase,
    GetFavoriteWorkoutPlansUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetUserFollowersUseCase,
    GetUserFollowingUseCase,
    GetPublicFeedUseCase,
    GetSocialStatsUseCase,

    // Repositories
    UserRepository,
    ProfileRepository,
    WorkoutPlanRepository,
    WorkoutDayRepository,
    ExerciseRepository,
    LikeRepository,
    FavoriteRepository,
    FollowRepository,

    // Infrastructure
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule {}
