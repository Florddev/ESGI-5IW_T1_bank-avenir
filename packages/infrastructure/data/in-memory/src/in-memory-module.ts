import { container, REPOSITORY_METADATA } from '@workspace/shared/di';
import './repositories';

export function registerInMemoryModule(): void {
    REPOSITORY_METADATA.forEach(({ implementation, token }) => {
        container.registerSingleton(token, implementation);
    });
}