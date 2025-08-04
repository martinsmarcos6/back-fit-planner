import { Injectable, BadRequestException } from "@nestjs/common";
import { WorkoutDay, type DayOfWeek } from "../../core/entities";
import { CreateWorkoutDayDto } from "../../core/dtos";
import { WorkoutDayRepository } from "../../frameworks/database/repositories/workout-day.repository";
import { WorkoutPlanRepository } from "../../frameworks/database/repositories/workout-plan.repository";

@Injectable()
export class CreateWorkoutDayUseCase {
  constructor(
    private readonly workoutDayRepository: WorkoutDayRepository,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
  ) {}

  async execute(
    workoutPlanId: string,
    userId: string,
    createDayDto: CreateWorkoutDayDto,
  ): Promise<WorkoutDay> {
    // Verificar se o plano existe e se o usuário é o dono
    const plan = await this.workoutPlanRepository.findById(workoutPlanId);
    if (!plan || plan.userId !== userId) {
      throw new BadRequestException("Plano de treino não encontrado");
    }

    // Verificar se já existe um treino para esse dia
    const existingDay = await this.workoutDayRepository.findByPlanAndDay(
      workoutPlanId,
      createDayDto.dayOfWeek as DayOfWeek,
    );
    if (existingDay) {
      throw new BadRequestException(
        "Já existe um treino definido para este dia",
      );
    }

    const day = WorkoutDay.create({
      workoutPlanId,
      dayOfWeek: createDayDto.dayOfWeek as DayOfWeek,
      workoutName: createDayDto.workoutName,
      description: createDayDto.description,
    });

    return this.workoutDayRepository.create(day);
  }
}
