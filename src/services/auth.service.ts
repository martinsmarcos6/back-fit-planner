import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, AuthResponseDto } from '../core/dtos';
import { RegisterUseCase } from '../use-cases/auth/register.use-case';
import { LoginUseCase } from '../use-cases/auth/login.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { user, profile } = await this.registerUseCase.execute(registerDto);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        profile: {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatar,
        },
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { user, profile } = await this.loginUseCase.execute(loginDto);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        profile: {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatar,
        },
      },
    };
  }
}