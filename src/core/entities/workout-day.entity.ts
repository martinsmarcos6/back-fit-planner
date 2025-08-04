export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export class WorkoutDay {
  public readonly id: string;
  public readonly workoutPlanId: string;
  public readonly dayOfWeek: DayOfWeek;
  public readonly workoutName: string; // Ex: "A", "B", "C", "Push", "Pull", etc.
  public readonly description: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id?: string;
    workoutPlanId: string;
    dayOfWeek: DayOfWeek;
    workoutName: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.workoutPlanId = props.workoutPlanId;
    this.dayOfWeek = props.dayOfWeek;
    this.workoutName = props.workoutName;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    workoutPlanId: string;
    dayOfWeek: DayOfWeek;
    workoutName: string;
    description?: string;
  }): WorkoutDay {
    return new WorkoutDay(props);
  }

  public updateDay(props: {
    workoutName?: string;
    description?: string | null;
  }): WorkoutDay {
    return new WorkoutDay({
      id: this.id,
      workoutPlanId: this.workoutPlanId,
      dayOfWeek: this.dayOfWeek,
      workoutName: props.workoutName ?? this.workoutName,
      description:
        props.description !== undefined ? props.description : this.description,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
