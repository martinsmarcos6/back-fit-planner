import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Follow } from "../../core/entities";
import { FollowRepository } from "../../frameworks/database/repositories/follow.repository";
import { UserRepository } from "../../frameworks/database/repositories/user.repository";

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(followerId: string, followingId: string): Promise<Follow> {
    // Verificar se não está tentando seguir a si mesmo
    if (followerId === followingId) {
      throw new BadRequestException("Usuário não pode seguir a si mesmo");
    }

    // Verificar se o usuário a ser seguido existe
    const userToFollow = await this.userRepository.findById(followingId);
    if (!userToFollow) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // Verificar se já está seguindo este usuário
    const existingFollow =
      await this.followRepository.findByFollowerAndFollowing(
        followerId,
        followingId,
      );

    if (existingFollow) {
      throw new BadRequestException("Usuário já está sendo seguido");
    }

    // Criar o follow
    const follow = Follow.create({
      followerId,
      followingId,
    });

    return this.followRepository.create(follow);
  }
}
