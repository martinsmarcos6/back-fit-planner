import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from "class-validator";
import { WorkoutDayResponseDto } from "./workout-day.dto";

// DTO para criar plano de treino
export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: "Nome deve ter entre 2 e 50 caracteres" })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Descrição deve ter no máximo 500 caracteres" })
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

// DTO para atualizar plano de treino
export class UpdateWorkoutPlanDto {
  @IsOptional()
  @IsString()
  @Length(2, 50, { message: "Nome deve ter entre 2 e 50 caracteres" })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Descrição deve ter no máximo 500 caracteres" })
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

// DTO para resposta do plano de treino
export class WorkoutPlanResponseDto {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  days?: WorkoutDayResponseDto[];
}

// DTO para busca de planos de treino
export class SearchWorkoutPlansDto {
  @IsOptional()
  @IsString()
  @Length(2, 30, { message: "Query deve ter entre 2 e 30 caracteres" })
  q?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsBoolean()
  publicOnly?: boolean;
}
