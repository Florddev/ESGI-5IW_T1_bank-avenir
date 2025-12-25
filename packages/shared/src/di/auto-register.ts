import { DependencyContainer } from 'tsyringe';
import { getRegistry } from './registry';
import { Scope } from './types';

export function autoRegisterAll(container: DependencyContainer): void {
    const registry = getRegistry();
    const registrations = registry.getAll();

    for (const registration of registrations) {
        const { token, implementation, scope } = registration;

        try {
            if (scope === Scope.Singleton) {
                container.registerSingleton(token, implementation);
            } else {
                container.register(token, { useClass: implementation });
            }
        } catch (error) {
            console.error(`Failed to register ${token}:`, error);
        }
    }
}

export function autoRegisterUseCases(container: DependencyContainer): void {
    const registry = getRegistry();
    const useCases = registry
        .getAll()
        .filter((r) => Reflect.getMetadata('di:usecase', r.implementation));

    for (const useCase of useCases) {
        container.registerSingleton(useCase.token, useCase.implementation);
    }
}
