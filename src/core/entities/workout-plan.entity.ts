export class WorkoutPlan {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly userId: string;
  public readonly isPublic: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id?: string;
    name: string;
    description?: string | null;
    userId: string;
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.description = props.description ?? null;
    this.userId = props.userId;
    this.isPublic = props.isPublic ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    name: string;
    description?: string;
    userId: string;
    isPublic?: boolean;
  }): WorkoutPlan {
    return new WorkoutPlan(props);
  }

  public updatePlan(props: {
    name?: string;
    description?: string | null;
    isPublic?: boolean;
  }): WorkoutPlan {
    return new WorkoutPlan({
      id: this.id,
      name: props.name ?? this.name,
      description:
        props.description !== undefined ? props.description : this.description,
      userId: this.userId,
      isPublic: props.isPublic ?? this.isPublic,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
