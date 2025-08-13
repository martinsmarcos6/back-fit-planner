import { BadRequestException } from "@nestjs/common";
import { CreateWorkoutDayUseCase } from "./create-workout-day.use-case";
import { WorkoutDayRepository } from "../../frameworks/database/repositories/workout-day.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";
import { type CreateWorkoutDayDto } from "../../core/dtos";

describe("CreateWorkoutDayUseCase (unit)", () => {
  let dayRepo: jest.Mocked<WorkoutDayRepository>;
  let planRepo: jest.Mocked<WorkoutPlanRepository>;
  let useCase: CreateWorkoutDayUseCase;

  beforeEach(() => {
    dayRepo = {
      findByPlanAndDay: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<WorkoutDayRepository>;
    planRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<WorkoutPlanRepository>;
    useCase = new CreateWorkoutDayUseCase(dayRepo, planRepo);
  });

  it("cria dia quando plano existe e não há duplicidade", async () => {
    (planRepo.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "u1",
    });
    (dayRepo.findByPlanAndDay as jest.Mock).mockResolvedValue(null);
    (dayRepo.create as jest.Mock).mockImplementation((d) => Promise.resolve(d));

    const dto: CreateWorkoutDayDto = {
      dayOfWeek: "monday",
      workoutName: "A",
      description: "desc",
    };
    const created = await useCase.execute("p1", "u1", dto);

    expect(created.workoutPlanId).toBe("p1");
    expect(created.dayOfWeek).toBe("monday");
  });

  it("falha se plano não pertence ao usuário", async () => {
    (planRepo.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "other",
    });
    const dto: CreateWorkoutDayDto = {
      dayOfWeek: "monday",
      workoutName: "A",
    };
    await expect(useCase.execute("p1", "u1", dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("falha se já existe dia para o mesmo dia da semana", async () => {
    (planRepo.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "u1",
    });
    (dayRepo.findByPlanAndDay as jest.Mock).mockResolvedValue({ id: "d1" });
    const dto2: CreateWorkoutDayDto = {
      dayOfWeek: "monday",
      workoutName: "A",
    };
    await expect(useCase.execute("p1", "u1", dto2)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
