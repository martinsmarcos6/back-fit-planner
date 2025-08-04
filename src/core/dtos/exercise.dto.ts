import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  Length,
  MaxLength,
} from "class-validator";

// DTO para criar exercício
export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 80, { message: "Nome deve ter entre 2 e 80 caracteres" })
  name: string;

  @IsNumber()
  @Min(1, { message: "Número de séries deve ser pelo menos 1" })
  @Max(20, { message: "Número de séries deve ser no máximo 20" })
  sets: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10, {
    message: "Faixa de repetições deve ter entre 1 e 10 caracteres",
  })
  repsRange: string; // Ex: "8-12", "10", "15-20"

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Peso deve ser positivo" })
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Tempo de descanso deve ser positivo" })
  restSeconds?: number;

  @IsNumber()
  @Min(1, { message: "Ordem deve ser pelo menos 1" })
  order: number;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: "Notas devem ter no máximo 300 caracteres" })
  notes?: string;
}

// DTO para atualizar exercício
export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  @Length(2, 80, { message: "Nome deve ter entre 2 e 80 caracteres" })
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Número de séries deve ser pelo menos 1" })
  @Max(20, { message: "Número de séries deve ser no máximo 20" })
  sets?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10, {
    message: "Faixa de repetições deve ter entre 1 e 10 caracteres",
  })
  repsRange?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Peso deve ser positivo" })
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Tempo de descanso deve ser positivo" })
  restSeconds?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Ordem deve ser pelo menos 1" })
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300, { message: "Notas devem ter no máximo 300 caracteres" })
  notes?: string;
}

// DTO para resposta do exercício
export class ExerciseResponseDto {
  id: string;
  name: string;
  sets: number;
  repsRange: string;
  weight?: number;
  restSeconds?: number;
  order: number;
  notes?: string;
  workoutDayId: string;
  createdAt: Date;
  updatedAt: Date;
}
