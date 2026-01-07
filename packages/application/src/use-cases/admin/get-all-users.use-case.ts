import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IUserRepository } from '../../ports';
import type { UserDto } from '../../dtos';

@UseCase()
export class GetAllUsersUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
