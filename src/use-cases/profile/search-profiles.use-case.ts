import { Injectable } from "@nestjs/common";
import { Profile } from "../../core/entities";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";

@Injectable()
export class SearchProfilesUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(query: string, limit: number = 10): Promise<Profile[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.profileRepository.searchByNameOrUsername(query.trim(), limit);
  }
}
