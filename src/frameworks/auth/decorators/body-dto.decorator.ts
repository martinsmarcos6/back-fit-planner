import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";

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
