import 'reflect-metadata';
import { injectable, inject as tsyringeInject } from 'tsyringe';

export type Constructor<T = any> = new (...args: any[]) => T;

export const REPOSITORY_METADATA = new Map<string, { 
    implementation: Constructor;
    token: symbol;
}>();

/**
 * Décorateur pour marquer les repositories.
 * Auto-enregistre les métadonnées pour l'enregistrement DI.
 * 
 * @param token - Token d'injection (symbol de TOKENS)
 * @example
 * ```typescript
 * @Repository(TOKENS.IUserRepository)
 * export class InMemoryUserRepository implements IUserRepository { }
 * ```
 */
export function Repository(token: symbol) {
    return function <T extends Constructor>(target: T) {
        injectable()(target);
        
        REPOSITORY_METADATA.set((target as any).name, {
            implementation: target,
            token: token
        });
        
        return target;
    };
}

/**
 * Décorateur pour marquer les use cases.
 * Les use cases sont auto-résolvables sans enregistrement manuel.
 * 
 * @example
 * ```typescript
 * @UseCase()
 * export class CreateUserUseCase {
 *   constructor(@Inject(TOKENS.IUserRepository) private userRepo: IUserRepository) {}
 * }
 * ```
 */
export function UseCase() {
    return function <T extends Constructor>(constructor: T) {
        injectable()(constructor);
        return constructor;
    };
}

/**
 * Décorateur pour marquer les services injectables.
 * 
 * @example
 * ```typescript
 * @Injectable()
 * export class AuthService { }
 * ```
 */
export function Injectable() {
    return injectable();
}

/**
 * Décorateur pour injecter une dépendance.
 * 
 * @param token - Token d'injection (string de TOKENS)
 * @example
 * ```typescript
 * constructor(@Inject(TOKENS.IUserRepository) private userRepo: IUserRepository) {}
 * ```
 */
export function Inject(token: symbol) {
    return tsyringeInject(token);
}