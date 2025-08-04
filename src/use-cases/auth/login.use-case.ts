import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "../../core/dtos";
import { Profile, User } from "../../core/entities";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";
import { UserRepository } from "../../frameworks/database/repositories/user.repository";

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(loginDto: LoginDto): Promise<{ user: User; profile: Profile }> {
    // Buscar usuário por email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // Buscar perfil do usuário
    const profile = await this.profileRepository.findByUserId(user.id);
    if (!profile) {
      throw new UnauthorizedException("Perfil não encontrado");
    }

    return { user, profile };
  }
}
