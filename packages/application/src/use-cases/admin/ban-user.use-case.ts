import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IUserRepository } from '../../ports';
import type { UserDto } from '../../dtos';
import { UserNotFoundError } from '@workspace/domain';

@UseCase()
export class BanUserUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    user.ban();
    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id,
      email: updatedUser.email.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
