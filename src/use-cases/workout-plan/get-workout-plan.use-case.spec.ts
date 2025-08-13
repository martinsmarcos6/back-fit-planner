import { NotFoundException } from "@nestjs/common";
import { GetWorkoutPlanUseCase } from "./get-workout-plan.use-case";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

describe("GetWorkoutPlanUseCase (unit)", () => {
  it("retorna planos por usuário", async () => {
    const repo = {
      findByUserId: jest.fn().mockResolvedValue([{ id: "p1", userId: "u1" }]),
    } as unknown as jest.Mocked<WorkoutPlanRepository>;
    const uc = new GetWorkoutPlanUseCase(repo);
    const plans = await uc.executeByUserId("u1");
    expect(Array.isArray(plans)).toBe(true);
  });

  it("retorna plano com ownership check quando válido", async () => {
    const repo = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: "p1", userId: "u1", isPublic: false }),
    } as unknown as jest.Mocked<WorkoutPlanRepository>;
    const uc = new GetWorkoutPlanUseCase(repo);
    const plan = await uc.executeWithOwnershipCheck("p1", "u1");
    expect(plan.id).toBe("p1");
  });

  it("lança NotFound quando não é dono e não é público", async () => {
    const repo = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: "p1", userId: "owner", isPublic: false }),
    } as unknown as jest.Mocked<WorkoutPlanRepository>;
    const uc = new GetWorkoutPlanUseCase(repo);
    await expect(
      uc.executeWithOwnershipCheck("p1", "other"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
