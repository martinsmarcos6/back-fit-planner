export class Like {
  public readonly id: string;
  public readonly userId: string;
  public readonly workoutPlanId: string;
  public readonly createdAt: Date;

  constructor(props: {
    id?: string;
    userId: string;
    workoutPlanId: string;
    createdAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.workoutPlanId = props.workoutPlanId;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: { userId: string; workoutPlanId: string }): Like {
    return new Like(props);
  }
}
