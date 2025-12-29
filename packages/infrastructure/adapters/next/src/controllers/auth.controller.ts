import { container, TOKENS } from '@workspace/shared/di';
import {
  RegisterUserUseCase,
  LoginUseCase,
  ConfirmAccountUseCase,
} from '@workspace/application/use-cases';
import type { RegisterUserDto, LoginDto, ConfirmAccountDto, AuthResponseDto, UserDto } from '@workspace/application/dtos';
import type { IAuthService, IUserRepository } from '@workspace/application/ports';

export class AuthController {
  async register(data: RegisterUserDto): Promise<{ message: string }> {
    const useCase = container.resolve(RegisterUserUseCase);
    await useCase.execute(data);

    return { 
      message: 'Inscription réussie. Veuillez vérifier vos emails pour confirmer votre compte.' 
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const useCase = container.resolve(LoginUseCase);
    const authResponse = await useCase.execute(data);

    return authResponse;
  }

  async confirmAccount(data: ConfirmAccountDto): Promise<{ message: string }> {
    const useCase = container.resolve(ConfirmAccountUseCase);
    await useCase.execute(data);

    return { 
      message: 'Compte confirmé avec succès. Vous pouvez maintenant vous connecter.' 
    };
  }

  async getCurrentUser(token: string): Promise<UserDto & { token: string }> {
    const authService = container.resolve<IAuthService>(TOKENS.IAuthService);
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      throw new Error('Token invalide');
    }

    const userRepository = container.resolve<IUserRepository>(TOKENS.IUserRepository);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
    };
  }
}
