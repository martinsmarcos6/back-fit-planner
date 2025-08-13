import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { ExerciseCatalogRepository } from "../frameworks/database/repositories/exercise-catalog.repository";

@ApiTags("exercise-catalog")
@ApiBearerAuth("JWT-auth")
@Controller("exercise-catalog")
export class ExerciseCatalogController {
  constructor(private readonly catalogRepo: ExerciseCatalogRepository) {}

  @Get()
  @ApiOperation({ summary: "Listar catálogo de exercícios" })
  @ApiResponse({ status: 200, description: "Lista retornada" })
  async list(@Query("q") q?: string) {
    if (q && q.trim().length > 0) {
      return this.catalogRepo.searchByName(q.trim());
    }
    return this.catalogRepo.listAll();
  }
}
