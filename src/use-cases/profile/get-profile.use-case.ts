import { Injectable } from "@nestjs/common";
import { Profile } from "../../core/entities";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async executeByUserId(userId: string): Promise<Profile | null> {
    return this.profileRepository.findByUserId(userId);
  }

  async executeById(profileId: string): Promise<Profile | null> {
    return this.profileRepository.findById(profileId);
  }

  async executeByUsername(username: string): Promise<Profile | null> {
    return this.profileRepository.findByUsername(username);
  }
}
