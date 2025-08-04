import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes desabilitado - usando decorator @BodyDto personalizado

  // CORS
  app.enableCors();

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("💪 Back Fit Planner API")
    .setDescription(
      "API completa para planejamento e acompanhamento de treinos, desenvolvida com NestJS seguindo os princípios da Clean Architecture.",
    )
    .setVersion("1.0")
    .addTag("auth", "Autenticação e registro de usuários")
    .addTag("profile", "Gerenciamento de perfis de usuário")
    .addTag("workout-plans", "Criação e gerenciamento de planos de treino")
    .addTag("workout-days", "Dias de treino dentro dos planos")
    .addTag("exercises", "Exercícios dentro dos dias de treino")
    .addTag(
      "social",
      "Funcionalidades sociais (curtidas, favoritos, seguidores)",
    )
    .addTag("metrics", "Métricas e tracking de progresso")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth", // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "Back Fit Planner API",
    customfavIcon: "💪",
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3f51b5 }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT ?? 3000}`);
  console.log(
    `📚 Documentação Swagger disponível em: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
void bootstrap();
