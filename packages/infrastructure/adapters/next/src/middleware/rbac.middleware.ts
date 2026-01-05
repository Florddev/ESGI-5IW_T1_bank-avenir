import { AuthContext } from './auth.middleware';
import { UnauthorizedError } from '@workspace/domain/errors';

// Re-export UserRole from domain for convenience
export { UserRole } from '@workspace/domain/entities';

/**
 * Middleware RBAC - Role-Based Access Control
 * Vérifie les permissions basées sur les rôles et la propriété des ressources
 */

/**
 * Vérifie que l'utilisateur a l'un des rôles requis
 * @param allowedRoles - Liste des rôles autorisés
 * @returns Fonction middleware qui vérifie le rôle de l'utilisateur
 * 
 * @example
 * ```typescript
 * const auth = await requireAuth()(request);
 * await requireRole([UserRole.DIRECTOR])(auth);
 * ```
 */
export function requireRole(allowedRoles: string[]) {
    return async (auth: AuthContext): Promise<void> => {
        if (!auth) {
            throw new UnauthorizedError('Authentication required');
        }

        if (!allowedRoles.includes(auth.role)) {
            throw new UnauthorizedError(
                `Role ${auth.role} is not authorized. Required roles: ${allowedRoles.join(', ')}`
            );
        }
    };
}

/**
 * Vérifie que l'utilisateur est propriétaire de la ressource
 * @param resourceUserId - ID de l'utilisateur propriétaire de la ressource
 * @returns Fonction middleware qui vérifie la propriété
 * 
 * @example
 * ```typescript
 * const auth = await requireAuth()(request);
 * const account = await controller.getAccount(params.id);
 * await requireOwnership(account.userId)(auth);
 * ```
 */
export function requireOwnership(resourceUserId: string) {
    return async (auth: AuthContext): Promise<void> => {
        if (!auth) {
            throw new UnauthorizedError('Authentication required');
        }

        // Les DIRECTOR et ADVISOR ont accès à toutes les ressources
        if (auth.role === 'DIRECTOR' || auth.role === 'ADVISOR') {
            return;
        }

        // Pour les autres rôles, vérifier que l'utilisateur est propriétaire
        if (auth.userId !== resourceUserId) {
            throw new UnauthorizedError('You are not authorized to access this resource');
        }
    };
}

/**
 * Vérifie que l'utilisateur est propriétaire OU a l'un des rôles requis
 * @param resourceUserId - ID de l'utilisateur propriétaire de la ressource
 * @param allowedRoles - Liste des rôles autorisés en plus du propriétaire
 * @returns Fonction middleware qui vérifie la propriété ou le rôle
 * 
 * @example
 * ```typescript
 * const auth = await requireAuth()(request);
 * await requireOwnershipOrRole(account.userId, [UserRole.ADVISOR, UserRole.DIRECTOR])(auth);
 * ```
 */
export function requireOwnershipOrRole(resourceUserId: string, allowedRoles: string[]) {
    return async (auth: AuthContext): Promise<void> => {
        if (!auth) {
            throw new UnauthorizedError('Authentication required');
        }

        // Vérifier si l'utilisateur est propriétaire
        const isOwner = auth.userId === resourceUserId;

        // Vérifier si l'utilisateur a un rôle autorisé
        const hasRole = allowedRoles.includes(auth.role);

        if (!isOwner && !hasRole) {
            throw new UnauthorizedError(
                'You are not authorized to access this resource'
            );
        }
    };
}

/**
 * Vérifie que l'utilisateur a le rôle DIRECTOR
 * @returns Fonction middleware qui vérifie le rôle DIRECTOR
 * 
 * @example
 * ```typescript
 * const auth = await requireAuth()(request);
 * await requireDirector()(auth);
 * ```
 */
export function requireDirector() {
    return requireRole(['DIRECTOR']);
}

/**
 * Vérifie que l'utilisateur a le rôle ADVISOR ou DIRECTOR
 * @returns Fonction middleware qui vérifie les rôles ADVISOR ou DIRECTOR
 * 
 * @example
 * ```typescript
 * const auth = await requireAuth()(request);
 * await requireAdvisorOrDirector()(auth);
 * ```
 */
export function requireAdvisorOrDirector() {
    return requireRole(['ADVISOR', 'DIRECTOR']);
}
