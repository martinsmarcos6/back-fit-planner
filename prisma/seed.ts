import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

const baseExercises: Array<{ name: string }> = [
  { name: "Agachamento Livre" },
  { name: "Levantamento Terra" },
  { name: "Supino Reto" },
  { name: "Supino Inclinado" },
  { name: "Desenvolvimento Militar" },
  { name: "Remada Curvada" },
  { name: "Remada Baixa" },
  { name: "Remada Unilateral" },
  { name: "Barra Fixa" },
  { name: "Puxada na Frente" },
  { name: "Pulldown" },
  { name: "Pull-over" },
  { name: "Rosca Direta" },
  { name: "Rosca Alternada" },
  { name: "Tríceps Testa" },
  { name: "Tríceps Corda" },
  { name: "Elevação Lateral" },
  { name: "Elevação Frontal" },
  { name: "Encolhimento de Ombros" },
  { name: "Afundo" },
  { name: "Leg Press" },
  { name: "Cadeira Extensora" },
  { name: "Mesa Flexora" },
  { name: "Stiff" },
  { name: "Levantamento Terra Romeno" },
  { name: "Panturrilha em Pé" },
  { name: "Panturrilha Sentado" },
  { name: "Crucifixo Reto" },
  { name: "Crucifixo Inclinado" },
  { name: "Crucifixo Inverso" },
  { name: "Face Pull" },
  { name: "Hip Thrust" },
  { name: "Abdominal Crunch" },
  { name: "Prancha" },
  { name: "Flexão de Braço" },
];

async function main() {
  let created = 0;
  for (const ex of baseExercises) {
    const id = randomUUID();
    const rowsInserted = await prisma.$executeRaw(
      Prisma.sql`INSERT INTO "exercise_catalog" ("id","name","createdAt","updatedAt")
      SELECT ${id}, ${ex.name}, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM "exercise_catalog" WHERE "name" = ${ex.name}
      )`,
    );
    if (typeof rowsInserted === "number" && rowsInserted > 0) {
      created += 1;
    }
  }
  console.log(
    `Seed do catálogo concluído. Novos exercícios criados: ${created}.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
