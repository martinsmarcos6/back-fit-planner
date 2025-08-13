import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateExerciseDto } from "../../core/dtos";
import { Exercise } from "../../core/entities";
import { ExerciseRepository } from "../../frameworks/database/repositories/exercise.repository";
import { ExerciseCatalogRepository } from "../../frameworks/database/repositories/exercise-catalog.repository";
import { WorkoutDayRepository } from "../../frameworks/database/repositories/workout-day.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class CreateExerciseUseCase {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly workoutDayRepository: WorkoutDayRepository,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
    private readonly exerciseCatalogRepository: ExerciseCatalogRepository,
  ) {}

  async execute(
    workoutDayId: string,
    userId: string,
    createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    // Verificar se o dia de treino existe
    const day = await this.workoutDayRepository.findById(workoutDayId);
    if (!day) {
      throw new BadRequestException("Dia de treino não encontrado");
    }

    // Verificar se o usuário é o dono do plano
    const plan = await this.workoutPlanRepository.findById(day.workoutPlanId);
    if (!plan || plan.userId !== userId) {
      throw new BadRequestException("Acesso negado");
    }

    // Se não foi especificada uma ordem, usar a próxima disponível
    const order =
      createExerciseDto.order ??
      (await this.exerciseRepository.getNextOrder(workoutDayId));

    // Buscar exercício base no catálogo
    const catalog = await this.exerciseCatalogRepository.findById(
      createExerciseDto.catalogId,
    );
    if (!catalog) {
      throw new BadRequestException("Exercício de catálogo não encontrado");
    }

    const exercise = Exercise.create({
      workoutDayId,
      catalogId: catalog.id,
      name: catalog.name,
      sets: createExerciseDto.sets,
      repsRange: createExerciseDto.repsRange,
      restSeconds: createExerciseDto.restSeconds,
      order,
      notes: createExerciseDto.notes,
    });

    return this.exerciseRepository.create(exercise);
  }
}
