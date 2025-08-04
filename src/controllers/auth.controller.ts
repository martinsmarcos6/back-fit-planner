import { Controller, Post } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthResponseDto, LoginDto, RegisterDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import { Public } from "../frameworks/auth/decorators/public.decorator";
import { AuthService } from "../services/auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Registrar novo usuário",
    description:
      "Cria uma nova conta de usuário com email, senha e informações de perfil",
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "Usuário criado com sucesso",
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiConflictResponse({ description: "Email ou username já em uso" })
  async register(
    @BodyDto(RegisterDto) registerDto: RegisterDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post("login")
  @ApiOperation({
    summary: "Fazer login",
    description:
      "Autentica um usuário com email e senha, retornando um token JWT",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login realizado com sucesso",
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiUnauthorizedResponse({ description: "Credenciais inválidas" })
  async login(@BodyDto(LoginDto) loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
