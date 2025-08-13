import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@prisma/client";

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ExerciseCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ExerciseCatalogItem | null> {
    const rows = await this.prisma.$queryRaw<ExerciseCatalogItem[]>(
      Prisma.sql`SELECT id, name, "createdAt", "updatedAt" FROM "exercise_catalog" WHERE id = ${id} LIMIT 1`,
    );
    return rows[0] ?? null;
  }

  async listAll(): Promise<ExerciseCatalogItem[]> {
    const rows = await this.prisma.$queryRaw<ExerciseCatalogItem[]>(
      Prisma.sql`SELECT id, name, "createdAt", "updatedAt" FROM "exercise_catalog" ORDER BY name ASC`,
    );
    return rows;
  }

  async searchByName(query: string): Promise<ExerciseCatalogItem[]> {
    const pattern = `%${query}%`;
    const rows = await this.prisma.$queryRaw<ExerciseCatalogItem[]>(
      Prisma.sql`SELECT id, name, "createdAt", "updatedAt" FROM "exercise_catalog" WHERE name ILIKE ${pattern} ORDER BY name ASC`,
    );
    return rows;
  }
}
