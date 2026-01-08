import { container, REPOSITORY_METADATA } from '@workspace/shared/di';

export function registerPostgresModule(): void {
  REPOSITORY_METADATA.forEach(({ implementation, token }) => {
    if (implementation.name.startsWith('Postgres')) {
      container.registerSingleton(token, implementation);
    }
  });
}
