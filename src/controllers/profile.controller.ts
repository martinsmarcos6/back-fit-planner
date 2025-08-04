import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { ProfileResponseDto, UpdateProfileDto } from "../core/dtos";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import { ProfileService } from "../services/profile.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("me")
  async getMyProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByUserId(currentUser.userId);
  }

  @Put("me")
  async updateMyProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
    @BodyDto(UpdateProfileDto) updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateProfile(
      currentUser.userId,
      updateProfileDto,
    );
  }

  @Get("search")
  async searchProfiles(
    @Query("q") query: string,
    @Query("limit") limit?: string,
  ): Promise<ProfileResponseDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.profileService.searchProfiles(query, limitNumber);
  }

  @Get(":identifier")
  async getProfileByIdentifier(
    @Param("identifier") identifier: string,
  ): Promise<ProfileResponseDto> {
    // Tentar buscar por ID primeiro, depois por username
    try {
      return await this.profileService.getProfileById(identifier);
    } catch {
      const profile =
        await this.profileService.getProfileByUsername(identifier);
      if (!profile) {
        throw new NotFoundException("Perfil não encontrado");
      }
      return profile;
    }
  }
}
