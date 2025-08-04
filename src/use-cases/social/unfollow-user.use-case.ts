import { Injectable, NotFoundException } from "@nestjs/common";
import { FollowRepository } from "../../frameworks/database/repositories/follow.repository";

@Injectable()
export class UnfollowUserUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    // Verificar se o follow existe
    const existingFollow =
      await this.followRepository.findByFollowerAndFollowing(
        followerId,
        followingId,
      );

    if (!existingFollow) {
      throw new NotFoundException("Você não está seguindo este usuário");
    }

    // Remover o follow
    await this.followRepository.delete(followerId, followingId);
  }
}
