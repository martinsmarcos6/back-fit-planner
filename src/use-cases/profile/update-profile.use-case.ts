import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateProfileDto } from "../../core/dtos";
import { Profile } from "../../core/entities";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<Profile> {
    // Buscar o perfil atual do usuário
    const currentProfile = await this.profileRepository.findByUserId(userId);
    if (!currentProfile) {
      throw new NotFoundException("Perfil não encontrado");
    }

    // Verificar se o username está sendo alterado e se já existe
    if (updateData.name && updateData.name !== currentProfile.name) {
      // Validação adicional se necessário
    }

    // Atualizar o perfil
    const updatedProfile = currentProfile.updateProfile({
      name: updateData.name,
      bio: updateData.bio,
      avatar: updateData.avatar,
    });

    return this.profileRepository.update(currentProfile.id, updatedProfile);
  }
}
