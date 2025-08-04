export class ExerciseRecord {
  public readonly id: string;
  public readonly userId: string;
  public readonly exerciseId: string;
  public readonly weight: number; // peso em kg
  public readonly notes: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id?: string;
    userId: string;
    exerciseId: string;
    weight: number;
    notes?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.exerciseId = props.exerciseId;
    this.weight = props.weight;
    this.notes = props.notes ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    userId: string;
    exerciseId: string;
    weight: number;
    notes?: string;
  }): ExerciseRecord {
    return new ExerciseRecord(props);
  }

  public updateRecord(props: {
    weight?: number;
    notes?: string | null;
  }): ExerciseRecord {
    return new ExerciseRecord({
      id: this.id,
      userId: this.userId,
      exerciseId: this.exerciseId,
      weight: props.weight ?? this.weight,
      notes: props.notes !== undefined ? props.notes : this.notes,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
