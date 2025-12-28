import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { IUserRepository } from '../../ports/repositories/user.repository';
import { IEmailService } from '../../ports/services';
import { ConfirmAccountDto } from '../../dtos/auth.dto';
import { InvalidConfirmationTokenError } from '@workspace/domain/errors';

@UseCase()
export class ConfirmAccountUseCase {
    constructor(
        @Inject(TOKENS.IUserRepository) private readonly userRepository: IUserRepository,
        @Inject(TOKENS.IEmailService) private readonly emailService: IEmailService,
    ) {}

    async execute(dto: ConfirmAccountDto): Promise<void> {
        const user = await this.userRepository.findByConfirmationToken(dto.token);

        if (!user) {
            throw new InvalidConfirmationTokenError();
        }

        user.confirm();
        await this.userRepository.save(user);
        await this.emailService.sendWelcomeEmail(user.email.toString(), user.firstName);
    }
}
