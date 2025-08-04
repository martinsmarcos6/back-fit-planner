import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "../../core/dtos";
import { Profile, User } from "../../core/entities";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";
import { UserRepository } from "../../frameworks/database/repositories/user.repository";

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    registerDto: RegisterDto,
  ): Promise<{ user: User; profile: Profile }> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException("Email já está em uso");
    }

    // Verificar se username já existe
    const existingProfile = await this.profileRepository.findByUsername(
      registerDto.username,
    );
    if (existingProfile) {
      throw new ConflictException("Username já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Criar usuário
    const user = User.create({
      email: registerDto.email,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.create(user);

    // Criar perfil
    const profile = Profile.create({
      username: registerDto.username,
      name: registerDto.name,
      userId: createdUser.id,
    });

    const createdProfile = await this.profileRepository.create(profile);

    return { user: createdUser, profile: createdProfile };
  }
}
