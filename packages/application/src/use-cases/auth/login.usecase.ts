import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { IUserRepository, IAuthService } from '../../ports';
import { LoginDto, AuthResponseDto } from '../../dtos/auth.dto';
import { Email, Password } from '@workspace/domain/value-objects';
import { UserStatus } from '@workspace/domain/entities';
import {
    InvalidCredentialsError,
    AccountNotConfirmedError,
    UserBannedError,
} from '@workspace/domain/errors';

@UseCase()
export class LoginUseCase {
    constructor(
        @Inject(TOKENS.IUserRepository) private readonly userRepository: IUserRepository,
        @Inject(TOKENS.IAuthService) private readonly authService: IAuthService,
    ) {}

    async execute(dto: LoginDto): Promise<AuthResponseDto> {
        const email = Email.fromString(dto.email);
        const user = await this.userRepository.findByEmail(email.toString());

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const password = Password.fromPlainText(dto.password);
        const isPasswordValid = await this.authService.comparePassword(
            password.getValue(),
            user.passwordHash.getValue(),
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        if (user.status === UserStatus.PENDING_CONFIRMATION) {
            throw new AccountNotConfirmedError();
        }

        if (user.status === UserStatus.BANNED) {
            throw new UserBannedError();
        }

        const token = this.authService.generateToken(user.id, user.role, user.email.toString());

        return {
            userId: user.id,
            email: user.email.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token,
        };
    }
}
