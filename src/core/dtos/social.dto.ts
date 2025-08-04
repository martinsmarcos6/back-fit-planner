import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

// DTO para curtir/descurtir um plano de treino
export class LikeWorkoutPlanDto {
  @IsUUID(4, { message: "workoutPlanId deve ser um UUID válido" })
  workoutPlanId: string;
}

// DTO para favoritar/desfavoritar um plano de treino
export class FavoriteWorkoutPlanDto {
  @IsUUID(4, { message: "workoutPlanId deve ser um UUID válido" })
  workoutPlanId: string;
}

// DTO para seguir/deixar de seguir um usuário
export class FollowUserDto {
  @IsUUID(4, { message: "userId deve ser um UUID válido" })
  userId: string;
}

// DTO de resposta para likes
export class LikeResponseDto {
  id: string;
  userId: string;
  workoutPlanId: string;
  createdAt: Date;
}

// DTO de resposta para favoritos
export class FavoriteResponseDto {
  id: string;
  userId: string;
  workoutPlanId: string;
  createdAt: Date;
}

// DTO de resposta para seguidores
export class FollowResponseDto {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// DTO para consulta do feed público com paginação
export class PublicFeedQueryDto {
  @IsOptional()
  @IsInt({ message: "page deve ser um número inteiro" })
  @Min(1, { message: "page deve ser maior que 0" })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: "limit deve ser um número inteiro" })
  @Min(1, { message: "limit deve ser maior que 0" })
  limit?: number = 10;
}

// DTO de resposta para o feed público
export class PublicFeedItemDto {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  userId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  };
  likesCount: number;
  isLikedByCurrentUser: boolean;
  isFavoritedByCurrentUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTO de resposta para estatísticas sociais
export class SocialStatsDto {
  followersCount: number;
  followingCount: number;
  workoutPlansCount: number;
  totalLikesReceived: number;
}
