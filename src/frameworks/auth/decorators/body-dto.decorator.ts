import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass, ClassConstructor } from "class-transformer";

export const BodyDto = createParamDecorator(
  async (dtoClass: ClassConstructor<object>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ body: unknown }>();
    const body = request.body;

    if (!body || typeof body !== "object") {
      throw new BadRequestException("Invalid request body");
    }

    // Criar instância do DTO
    const dto = plainToClass(dtoClass, body as Record<string, unknown>);

    // Validar usando class-validator
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join("; ");
      throw new BadRequestException(errorMessages);
    }

    return dto;
  },
);
