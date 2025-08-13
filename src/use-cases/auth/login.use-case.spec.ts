import { UnauthorizedException } from "@nestjs/common";
import { LoginUseCase } from "./login.use-case";
import { UserRepository } from "../../frameworks/database/repositories/user.repository";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";
import * as bcrypt from "bcryptjs";
import { type LoginDto } from "../../core/dtos";

describe("LoginUseCase (unit)", () => {
  it("loga quando credenciais corretas", async () => {
    jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValue(Promise.resolve(true) as unknown as never);
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: "u1", password: "hash" }),
    } as unknown as jest.Mocked<UserRepository>;
    const profileRepo = {
      findByUserId: jest.fn().mockResolvedValue({ id: "p1", userId: "u1" }),
    } as unknown as jest.Mocked<ProfileRepository>;
    const uc = new LoginUseCase(userRepo, profileRepo);
    const res = await uc.execute({
      email: "a@a.com",
      password: "123",
    } as LoginDto);
    expect(res.user.id).toBe("u1");
    expect(res.profile.userId).toBe("u1");
  });

  it("falha quando senha incorreta", async () => {
    jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValue(Promise.resolve(false) as unknown as never);
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: "u1", password: "hash" }),
    } as unknown as jest.Mocked<UserRepository>;
    const profileRepo = {
      findByUserId: jest.fn().mockResolvedValue({ id: "p1", userId: "u1" }),
    } as unknown as jest.Mocked<ProfileRepository>;
    const uc = new LoginUseCase(userRepo, profileRepo);
    await expect(
      uc.execute({ email: "a@a.com", password: "x" } as LoginDto),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
