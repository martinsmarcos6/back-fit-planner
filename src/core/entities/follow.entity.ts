export class Follow {
  public readonly id: string;
  public readonly followerId: string;
  public readonly followingId: string;
  public readonly createdAt: Date;

  constructor(props: {
    id?: string;
    followerId: string;
    followingId: string;
    createdAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.followerId = props.followerId;
    this.followingId = props.followingId;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: { followerId: string; followingId: string }): Follow {
    if (props.followerId === props.followingId) {
      throw new Error("Usuário não pode seguir a si mesmo");
    }

    return new Follow(props);
  }
}
