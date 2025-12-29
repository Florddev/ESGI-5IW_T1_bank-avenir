import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { IUserRepository, IAuthService, IEmailService } from '../../ports';
import { RegisterUserDto } from '../../dtos/auth.dto';
import { User, UserRole, UserStatus } from '@workspace/domain/entities';
import { Email, Password } from '@workspace/domain/value-objects';
import { UserAlreadyExistsError } from '@workspace/domain/errors';

@UseCase()
export class RegisterUserUseCase {
    constructor(
        @Inject(TOKENS.IUserRepository) private readonly userRepository: IUserRepository,
        @Inject(TOKENS.IAuthService) private readonly authService: IAuthService,
        @Inject(TOKENS.IEmailService) private readonly emailService: IEmailService,
    ) {}

    async execute(dto: RegisterUserDto): Promise<void> {
        const email = Email.fromString(dto.email);

        const existingUser = await this.userRepository.findByEmail(email.toString());
        if (existingUser) {
            throw new UserAlreadyExistsError(dto.email);
        }

        const password = Password.fromPlainText(dto.password);
        const passwordHash = await this.authService.hashPassword(password.getValue());
        const confirmationToken = crypto.randomUUID();

        const user = User.create({
            email,
            passwordHash: Password.fromHash(passwordHash),
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: UserRole.CLIENT,
            status: UserStatus.PENDING_CONFIRMATION,
            confirmationToken,
        });

        await this.userRepository.save(user);
        await this.emailService.sendConfirmationEmail(email.toString(), confirmationToken);
    }
}
