import { Controller, Post } from "@nestjs/common";
import { AuthResponseDto, LoginDto, RegisterDto } from "../core/dtos";
import { Public } from "../frameworks/auth/decorators/public.decorator";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  async register(
    @BodyDto(RegisterDto) registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post("login")
  async login(@BodyDto(LoginDto) loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
