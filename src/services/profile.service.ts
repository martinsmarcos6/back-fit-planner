import { Injectable, NotFoundException } from "@nestjs/common";
import { Profile } from "@prisma/client";
import { ProfileResponseDto, UpdateProfileDto } from "../core/dtos";
import { GetProfileUseCase } from "../use-cases/profile/get-profile.use-case";
import { SearchProfilesUseCase } from "../use-cases/profile/search-profiles.use-case";
import { UpdateProfileUseCase } from "../use-cases/profile/update-profile.use-case";

@Injectable()
export class ProfileService {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly searchProfilesUseCase: SearchProfilesUseCase,
  ) {}

  async getProfileByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.getProfileUseCase.executeByUserId(userId);
    if (!profile) {
      throw new NotFoundException("Perfil não encontrado");
    }
    return this.mapToResponseDto(profile as Profile);
  }

  async getProfileById(profileId: string): Promise<ProfileResponseDto> {
    const profile = await this.getProfileUseCase.executeById(profileId);
    if (!profile) {
      throw new NotFoundException("Perfil não encontrado");
    }
    return this.mapToResponseDto(profile as Profile);
  }

  async getProfileByUsername(
    username: string,
  ): Promise<ProfileResponseDto | null> {
    const profile = await this.getProfileUseCase.executeByUsername(username);
    return profile ? this.mapToResponseDto(profile as Profile) : null;
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const updatedProfile = await this.updateProfileUseCase.execute(
      userId,
      updateData,
    );
    return this.mapToResponseDto(updatedProfile as Profile);
  }

  async searchProfiles(
    query: string,
    limit: number,
  ): Promise<ProfileResponseDto[]> {
    const profiles = await this.searchProfilesUseCase.execute(query, limit);
    return profiles.map((profile) => this.mapToResponseDto(profile as Profile));
  }

  private mapToResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio ?? undefined,
      avatar: profile.avatar ?? undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
