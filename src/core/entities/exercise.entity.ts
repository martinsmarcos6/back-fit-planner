export class Exercise {
  public readonly id: string;
  public readonly workoutDayId: string;
  public readonly name: string;
  public readonly sets: number;
  public readonly repsRange: string; // Ex: "8-12", "10", "15-20"
  public readonly restSeconds: number | null;
  public readonly order: number;
  public readonly notes: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id?: string;
    workoutDayId: string;
    name: string;
    sets: number;
    repsRange: string;
    restSeconds?: number | null;
    order: number;
    notes?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.workoutDayId = props.workoutDayId;
    this.name = props.name;
    this.sets = props.sets;
    this.repsRange = props.repsRange;
    this.restSeconds = props.restSeconds ?? null;
    this.order = props.order;
    this.notes = props.notes ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    workoutDayId: string;
    name: string;
    sets: number;
    repsRange: string;
    restSeconds?: number;
    order: number;
    notes?: string;
  }): Exercise {
    return new Exercise(props);
  }

  public updateExercise(props: {
    name?: string;
    sets?: number;
    repsRange?: string;
    weight?: number | null;
    restSeconds?: number | null;
    order?: number;
    notes?: string | null;
  }): Exercise {
    return new Exercise({
      id: this.id,
      workoutDayId: this.workoutDayId,
      name: props.name ?? this.name,
      sets: props.sets ?? this.sets,
      repsRange: props.repsRange ?? this.repsRange,
      restSeconds:
        props.restSeconds !== undefined ? props.restSeconds : this.restSeconds,
      order: props.order ?? this.order,
      notes: props.notes !== undefined ? props.notes : this.notes,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
