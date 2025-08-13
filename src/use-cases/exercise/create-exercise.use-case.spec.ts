import { BadRequestException } from "@nestjs/common";
import { CreateExerciseUseCase } from "./create-exercise.use-case";
import { ExerciseRepository } from "../../frameworks/database/repositories/exercise.repository";
import { WorkoutDayRepository } from "../../frameworks/database/repositories/workout-day.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";
import { ExerciseCatalogRepository } from "../../frameworks/database/repositories/exercise-catalog.repository";
import { Exercise } from "../../core/entities";
import { type CreateExerciseDto } from "../../core/dtos";

describe("CreateExerciseUseCase (unit)", () => {
  let exerciseRepo: jest.Mocked<ExerciseRepository>;
  let dayRepo: jest.Mocked<WorkoutDayRepository>;
  let planRepo: jest.Mocked<WorkoutPlanRepository>;
  let catalogRepo: jest.Mocked<ExerciseCatalogRepository>;
  let useCase: CreateExerciseUseCase;

  beforeEach(() => {
    exerciseRepo = {
      getNextOrder: jest.fn().mockResolvedValue(1),
      create: jest.fn(),
    } as unknown as jest.Mocked<ExerciseRepository>;

    dayRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<WorkoutDayRepository>;

    planRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<WorkoutPlanRepository>;

    catalogRepo = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ExerciseCatalogRepository>;

    useCase = new CreateExerciseUseCase(
      exerciseRepo,
      dayRepo,
      planRepo,
      catalogRepo,
    );
  });

  it("cria exercício a partir do catálogo", async () => {
    (dayRepo.findById as jest.Mock).mockResolvedValue({
      id: "day-1",
      workoutPlanId: "plan-1",
    });
    (planRepo.findById as jest.Mock).mockResolvedValue({
      id: "plan-1",
      userId: "u1",
    });
    (catalogRepo.findById as jest.Mock).mockResolvedValue({
      id: "cat-1",
      name: "Supino Reto",
    });
    (exerciseRepo.create as jest.Mock).mockImplementation((ex: Exercise) =>
      Promise.resolve(ex),
    );

    const dto: CreateExerciseDto = {
      catalogId: "cat-1",
      sets: 3,
      repsRange: "8-12",
      restSeconds: 90,
      order: 1,
      notes: "test",
    };

    const created = await useCase.execute("day-1", "u1", dto);

    expect(created.workoutDayId).toBe("day-1");
    expect(created.catalogId).toBe("cat-1");
    expect(created.name).toBe("Supino Reto");
    expect(created.sets).toBe(3);
    const createSpy = jest.spyOn(exerciseRepo, "create");
    expect(createSpy).toHaveBeenCalled();
  });

  it("falha se catálogo não encontrado", async () => {
    (dayRepo.findById as jest.Mock).mockResolvedValue({
      id: "day-1",
      workoutPlanId: "plan-1",
    });
    (planRepo.findById as jest.Mock).mockResolvedValue({
      id: "plan-1",
      userId: "u1",
    });
    (catalogRepo.findById as jest.Mock).mockResolvedValue(null);

    const dto: CreateExerciseDto = {
      catalogId: "cat-x",
      sets: 3,
      repsRange: "8-12",
      order: 1,
    };

    await expect(useCase.execute("day-1", "u1", dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
