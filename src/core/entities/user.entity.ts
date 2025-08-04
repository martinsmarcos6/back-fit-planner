export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    email: string;
    password: string;
  }): User {
    return new User(props);
  }

  public updatePassword(newPassword: string): User {
    return new User({
      id: this.id,
      email: this.email,
      password: newPassword,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}