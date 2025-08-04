import { Injectable } from '@nestjs/common';
import { Profile } from '../../../core/entities';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) return null;

    return new Profile({
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio ?? undefined,
      avatar: profile.avatar ?? undefined,
      userId: profile.userId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  async findByUsername(username: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
    });

    if (!profile) return null;

    return new Profile({
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio ?? undefined,
      avatar: profile.avatar ?? undefined,
      userId: profile.userId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  async create(profile: Profile): Promise<Profile> {
    const createdProfile = await this.prisma.profile.create({
      data: {
        id: profile.id,
        username: profile.username,
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        userId: profile.userId,
      },
    });

    return new Profile({
      id: createdProfile.id,
      username: createdProfile.username,
      name: createdProfile.name,
      bio: createdProfile.bio ?? undefined,
      avatar: createdProfile.avatar ?? undefined,
      userId: createdProfile.userId,
      createdAt: createdProfile.createdAt,
      updatedAt: createdProfile.updatedAt,
    });
  }

  async update(id: string, profileData: Partial<Profile>): Promise<Profile> {
    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data: {
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar,
      },
    });

    return new Profile({
      id: updatedProfile.id,
      username: updatedProfile.username,
      name: updatedProfile.name,
      bio: updatedProfile.bio ?? undefined,
      avatar: updatedProfile.avatar ?? undefined,
      userId: updatedProfile.userId,
      createdAt: updatedProfile.createdAt,
      updatedAt: updatedProfile.updatedAt,
    });
  }
}