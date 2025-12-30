import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { IUserRepository, IEmailService, IAccountRepository } from '../../ports';
import { ConfirmAccountDto } from '../../dtos/auth.dto';
import { InvalidConfirmationTokenError } from '@workspace/domain/errors';
import { Account, AccountType, UserRole } from '@workspace/domain/entities';

@UseCase()
export class ConfirmAccountUseCase {
    constructor(
        @Inject(TOKENS.IUserRepository) private readonly userRepository: IUserRepository,
        @Inject(TOKENS.IEmailService) private readonly emailService: IEmailService,
        @Inject(TOKENS.IAccountRepository) private readonly accountRepository: IAccountRepository,
    ) {}

    async execute(dto: ConfirmAccountDto): Promise<void> {
        const user = await this.userRepository.findByConfirmationToken(dto.token);

        if (!user) {
            throw new InvalidConfirmationTokenError();
        }

        user.confirm();
        await this.userRepository.save(user);

        if (user.role === UserRole.CLIENT) {
            const account = Account.create(user.id, 'Compte Principal', AccountType.CHECKING);
            await this.accountRepository.save(account);
        }

        await this.emailService.sendWelcomeEmail(user.email.toString(), user.firstName);
    }
}
