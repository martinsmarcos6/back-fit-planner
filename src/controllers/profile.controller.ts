import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ProfileResponseDto, UpdateProfileDto } from "../core/dtos";
import { BodyDto } from "../frameworks/auth/decorators/body-dto.decorator";
import {
  CurrentUser,
  type CurrentUserPayload,
} from "../frameworks/auth/decorators/current-user.decorator";
import { ProfileService } from "../services/profile.service";

@ApiTags("profile")
@ApiBearerAuth("JWT-auth")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("me")
  @ApiOperation({
    summary: "Obter meu perfil",
    description: "Retorna as informações do perfil do usuário autenticado",
  })
  @ApiResponse({
    status: 200,
    description: "Perfil encontrado com sucesso",
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
  async getMyProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByUserId(currentUser.userId);
  }

  @Put("me")
  @ApiOperation({
    summary: "Atualizar meu perfil",
    description: "Atualiza as informações do perfil do usuário autenticado",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: "Perfil atualizado com sucesso",
    type: ProfileResponseDto,
  })
  @ApiBadRequestResponse({ description: "Dados de entrada inválidos" })
  @ApiUnauthorizedResponse({ description: "Token de autenticação inválido" })
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
  @ApiOperation({
    summary: "Buscar perfis",
    description: "Busca perfis de usuários por nome ou username",
  })
  @ApiQuery({
    name: "q",
    description: "Termo de busca (nome ou username)",
    example: "João",
  })
  @ApiQuery({
    name: "limit",
    description: "Número máximo de resultados",
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Busca realizada com sucesso",
    type: [ProfileResponseDto],
  })
  @ApiBadRequestResponse({ description: "Parâmetros de busca inválidos" })
  async searchProfiles(
    @Query("q") query: string,
    @Query("limit") limit?: string,
  ): Promise<ProfileResponseDto[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.profileService.searchProfiles(query, limitNumber);
  }

  @Get(":identifier")
  @ApiOperation({
    summary: "Obter perfil por ID ou username",
    description: "Busca um perfil específico por ID ou username",
  })
  @ApiParam({
    name: "identifier",
    description: "ID do usuário ou username",
    example: "joao_silva",
  })
  @ApiResponse({
    status: 200,
    description: "Perfil encontrado com sucesso",
    type: ProfileResponseDto,
  })
  @ApiNotFoundResponse({ description: "Perfil não encontrado" })
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
