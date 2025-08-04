import { IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

// DTO para registrar peso de exercício
export class CreateExerciseRecordDto {
  @IsUUID(4, { message: "exerciseId deve ser um UUID válido" })
  exerciseId: string;

  @IsNumber({}, { message: "weight deve ser um número" })
  @Min(0, { message: "weight deve ser maior ou igual a 0" })
  weight: number;

  @IsOptional()
  @IsString({ message: "notes deve ser uma string" })
  notes?: string;
}

// DTO para atualizar registro de peso
export class UpdateExerciseRecordDto {
  @IsOptional()
  @IsNumber({}, { message: "weight deve ser um número" })
  @Min(0, { message: "weight deve ser maior ou igual a 0" })
  weight?: number;

  @IsOptional()
  @IsString({ message: "notes deve ser uma string" })
  notes?: string;
}

// DTO de resposta para registro de exercício
export class ExerciseRecordResponseDto {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// DTO de resposta para histórico de progressão
export class ExerciseProgressResponseDto {
  exerciseId: string;
  exerciseName: string;
  progress: Array<{
    id: string;
    weight: number;
    notes: string | null;
    date: Date;
  }>;
  currentWeight: number | null;
  maxWeight: number | null;
  totalRecords: number;
}
