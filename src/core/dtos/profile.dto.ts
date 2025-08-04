import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from "class-validator";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30, { message: "Username deve ter entre 3 e 30 caracteres" })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: "Nome deve ter entre 2 e 100 caracteres" })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: "Bio deve ter no máximo 500 caracteres" })
  bio?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "Avatar deve ser uma URL válida" })
  avatar?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: "Nome deve ter entre 2 e 100 caracteres" })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Bio deve ter no máximo 500 caracteres" })
  bio?: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: "Avatar deve ser uma URL válida" })
  avatar?: string;
}

export class ProfileResponseDto {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileSearchDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: "Query deve ter entre 2 e 50 caracteres" })
  q: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
