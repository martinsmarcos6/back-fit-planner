import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

// Configuration
import { appConfig, jwtConfig } from './configuration';

// Controllers
import { AuthController } from './controllers';

// Services
import { AuthService } from './services';

// Use Cases
import { RegisterUseCase } from './use-cases/auth/register.use-case';
import { LoginUseCase } from './use-cases/auth/login.use-case';

// Frameworks
import { PrismaService } from './frameworks/database/prisma.service';
import { UserRepository } from './frameworks/database/repositories/user.repository';
import { ProfileRepository } from './frameworks/database/repositories/profile.repository';
import { JwtStrategy } from './frameworks/auth/jwt.strategy';
import { JwtAuthGuard } from './frameworks/auth/jwt-auth.guard';

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
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    RegisterUseCase,
    LoginUseCase,
    UserRepository,
    ProfileRepository,
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule { }
