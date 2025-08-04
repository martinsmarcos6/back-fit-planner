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
  ProfileController,
  WorkoutPlanController,
  WorkoutDayController,
  ExerciseController,
} from "./controllers";
import { JwtStrategy } from "./frameworks/auth/jwt.strategy";
import { JwtAuthGuard } from "./frameworks/auth/jwt-auth.guard";
// Frameworks
import { PrismaService } from "./frameworks/database/prisma.service";
import { ProfileRepository } from "./frameworks/database/repositories/profile.repository";
import { UserRepository } from "./frameworks/database/repositories/user.repository";
import { WorkoutPlanRepository } from "./frameworks/database/repositories/workout-plan.repository";
import { WorkoutDayRepository } from "./frameworks/database/repositories/workout-day.repository";
import { ExerciseRepository } from "./frameworks/database/repositories/exercise.repository";
// Services
import { AuthService, ProfileService } from "./services";
import { LoginUseCase } from "./use-cases/auth/login.use-case";
// Use Cases
import { RegisterUseCase } from "./use-cases/auth/register.use-case";
import { GetProfileUseCase } from "./use-cases/profile/get-profile.use-case";
import { SearchProfilesUseCase } from "./use-cases/profile/search-profiles.use-case";
import { UpdateProfileUseCase } from "./use-cases/profile/update-profile.use-case";
import { CreateWorkoutPlanUseCase } from "./use-cases/workout-plan/create-workout-plan.use-case";
import { GetWorkoutPlanUseCase } from "./use-cases/workout-plan/get-workout-plan.use-case";
import { CreateWorkoutDayUseCase } from "./use-cases/workout-day/create-workout-day.use-case";
import { CreateExerciseUseCase } from "./use-cases/exercise/create-exercise.use-case";
import { GetWorkoutDayUseCase } from "./use-cases/workout-day/get-workout-day.use-case";

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
    ProfileController,
    WorkoutPlanController,
    WorkoutDayController,
    ExerciseController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    ProfileService,
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
    UserRepository,
    ProfileRepository,
    WorkoutPlanRepository,
    WorkoutDayRepository,
    ExerciseRepository,
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule {}
