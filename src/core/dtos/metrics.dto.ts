import { IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// DTO para registrar peso de exercício
export class CreateExerciseRecordDto {
  @ApiProperty({
    description: "ID do exercício",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID(4, { message: "exerciseId deve ser um UUID válido" })
  exerciseId: string;

  @ApiProperty({
    description: "Peso utilizado em kg",
    example: 30.5,
    minimum: 0,
  })
  @IsNumber({}, { message: "weight deve ser um número" })
  @Min(0, { message: "weight deve ser maior ou igual a 0" })
  weight: number;

  @ApiPropertyOptional({
    description: "Observações sobre o treino",
    example: "Consegui fazer 3x10 hoje!",
  })
  @IsOptional()
  @IsString({ message: "notes deve ser uma string" })
  notes?: string;
}

// DTO para atualizar registro de peso
export class UpdateExerciseRecordDto {
  @ApiPropertyOptional({
    description: "Peso utilizado em kg",
    example: 35.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: "weight deve ser um número" })
  @Min(0, { message: "weight deve ser maior ou igual a 0" })
  weight?: number;

  @ApiPropertyOptional({
    description: "Observações sobre o treino",
    example: "Melhorou a execução hoje",
  })
  @IsOptional()
  @IsString({ message: "notes deve ser uma string" })
  notes?: string;
}

// DTO de resposta para registro de exercício
export class ExerciseRecordResponseDto {
  @ApiProperty({ description: "ID único do registro", example: "rec123" })
  id: string;

  @ApiProperty({ description: "ID do usuário", example: "user123" })
  userId: string;

  @ApiProperty({ description: "ID do exercício", example: "ex123" })
  exerciseId: string;

  @ApiProperty({ description: "Nome do exercício", example: "Supino Reto" })
  exerciseName: string;

  @ApiProperty({ description: "Peso utilizado em kg", example: 30.5 })
  weight: number;

  @ApiProperty({
    description: "Observações",
    example: "Consegui fazer 3x10!",
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: "Data de criação",
    example: "2024-01-01T10:00:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Data de atualização",
    example: "2024-01-01T10:00:00Z",
  })
  updatedAt: Date;
}

// DTO de resposta para histórico de progressão
export class ExerciseProgressResponseDto {
  @ApiProperty({ description: "ID do exercício", example: "ex123" })
  exerciseId: string;

  @ApiProperty({ description: "Nome do exercício", example: "Supino Reto" })
  exerciseName: string;

  @ApiProperty({
    description: "Histórico de registros de peso",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string", example: "rec123" },
        weight: { type: "number", example: 30.5 },
        notes: { type: "string", example: "Ótimo treino!", nullable: true },
        date: {
          type: "string",
          format: "date-time",
          example: "2024-01-01T10:00:00Z",
        },
      },
    },
  })
  progress: Array<{
    id: string;
    weight: number;
    notes: string | null;
    date: Date;
  }>;

  @ApiProperty({
    description: "Peso atual (mais recente)",
    example: 30.5,
    nullable: true,
  })
  currentWeight: number | null;

  @ApiProperty({
    description: "Maior peso já registrado",
    example: 35.0,
    nullable: true,
  })
  maxWeight: number | null;

  @ApiProperty({ description: "Total de registros", example: 5 })
  totalRecords: number;
}
