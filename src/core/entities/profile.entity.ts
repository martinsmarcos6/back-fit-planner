export class Profile {
  public readonly id: string;
  public readonly username: string;
  public readonly name: string;
  public readonly bio?: string;
  public readonly avatar?: string;
  public readonly userId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: {
    id?: string;
    username: string;
    name: string;
    bio?: string;
    avatar?: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id ?? crypto.randomUUID();
    this.username = props.username;
    this.name = props.name;
    this.bio = props.bio;
    this.avatar = props.avatar;
    this.userId = props.userId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: {
    username: string;
    name: string;
    bio?: string;
    avatar?: string;
    userId: string;
  }): Profile {
    return new Profile(props);
  }

  public updateProfile(props: {
    name?: string;
    bio?: string;
    avatar?: string;
  }): Profile {
    return new Profile({
      id: this.id,
      username: this.username,
      name: props.name ?? this.name,
      bio: props.bio ?? this.bio,
      avatar: props.avatar ?? this.avatar,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}