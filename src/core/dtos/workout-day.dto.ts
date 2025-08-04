import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  Length,
  MaxLength,
} from "class-validator";

// Dias da semana válidos
const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

// DTO para criar dia de treino
export class CreateWorkoutDayDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(DAYS_OF_WEEK, { message: "Dia da semana inválido" })
  dayOfWeek: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20, { message: "Nome do treino deve ter entre 1 e 20 caracteres" })
  workoutName: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: "Descrição deve ter no máximo 300 caracteres" })
  description?: string;
}

// DTO para atualizar dia de treino
export class UpdateWorkoutDayDto {
  @IsOptional()
  @IsString()
  @Length(1, 20, { message: "Nome do treino deve ter entre 1 e 20 caracteres" })
  workoutName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: "Descrição deve ter no máximo 300 caracteres" })
  description?: string;
}

// DTO para resposta do dia de treino
export class WorkoutDayResponseDto {
  id: string;
  dayOfWeek: string;
  workoutName: string;
  description?: string;
  workoutPlanId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Exportar os dias da semana para uso em outros lugares
export { DAYS_OF_WEEK };
