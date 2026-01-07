import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IUserRepository, IAccountRepository } from '../../ports';
import { User, UserRole, UserStatus, Email, Password, Account, AccountType } from '@workspace/domain';
import type { UserDto } from '../../dtos';

@UseCase()
export class CreateUserAccountUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository,
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole = UserRole.CLIENT
  ): Promise<UserDto> {
    const userEmail = Email.fromString(email);
    const userPassword = await Password.fromPlainText(password);

    // Créer l'utilisateur avec statut ACTIVE (pas besoin de confirmation pour admin)
    const user = User.create({
      email: userEmail,
      passwordHash: userPassword,
      firstName,
      lastName,
      role,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    // Créer automatiquement un compte courant pour le client
    if (role === UserRole.CLIENT) {
      const account = Account.create(
        savedUser.id,
        'Compte Principal',
        AccountType.CHECKING
      );
      await this.accountRepository.save(account);
    }

    return {
      id: savedUser.id,
      email: savedUser.email.toString(),
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      status: savedUser.status,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
