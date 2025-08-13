import { ConflictException } from "@nestjs/common";
import { RegisterUseCase } from "./register.use-case";
import { UserRepository } from "../../frameworks/database/repositories/user.repository";
import { ProfileRepository } from "../../frameworks/database/repositories/profile.repository";
import * as bcrypt from "bcryptjs";
// no-op

describe("RegisterUseCase (unit)", () => {
  it("cria user e profile quando dados livres", async () => {
    jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValue(Promise.resolve("hash") as unknown as never);
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn((u) => Promise.resolve({ ...u, id: "u1" })),
    } as unknown as jest.Mocked<UserRepository>;
    const profileRepo = {
      findByUsername: jest.fn().mockResolvedValue(null),
      create: jest.fn((p) => Promise.resolve({ ...p, id: "p1" })),
    } as unknown as jest.Mocked<ProfileRepository>;
    const uc = new RegisterUseCase(userRepo, profileRepo);
    const res = await uc.execute({
      email: "a@a.com",
      password: "123456",
      username: "john",
      name: "John",
    } as { email: string; password: string; username: string; name: string });
    expect(res.user.id).toBeDefined();
    expect(res.profile.userId).toBeDefined();
  });

  it("falha quando email já existe", async () => {
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: "u1" }),
    } as unknown as jest.Mocked<UserRepository>;
    const profileRepo = {
      findByUsername: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<ProfileRepository>;
    const uc = new RegisterUseCase(userRepo, profileRepo);
    await expect(
      uc.execute({
        email: "a@a.com",
        password: "123456",
        username: "j",
        name: "n",
      } as { email: string; password: string; username: string; name: string }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
