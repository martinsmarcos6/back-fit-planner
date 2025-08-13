import { CreateWorkoutPlanUseCase } from "./create-workout-plan.use-case";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

describe("CreateWorkoutPlanUseCase (unit)", () => {
  it("cria plano com valores do DTO", async () => {
    const repo = {
      create: jest.fn((p) => Promise.resolve(p)),
    } as unknown as jest.Mocked<WorkoutPlanRepository>;
    const useCase = new CreateWorkoutPlanUseCase(repo);

    const created = await useCase.execute("u1", {
      name: "Plano X",
      description: "desc",
      isPublic: true,
    });

    expect(created.userId).toBe("u1");
    expect(created.name).toBe("Plano X");
    expect(created.isPublic).toBe(true);
  });
});
