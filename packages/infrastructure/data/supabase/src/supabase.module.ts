import { container, REPOSITORY_METADATA } from '@workspace/shared/di';
import { SupabaseClientService } from './supabase.client';
import './repositories';

export function registerSupabaseModule(): void {
    container.registerSingleton(SupabaseClientService, SupabaseClientService);

    REPOSITORY_METADATA.forEach(({ implementation, token }) => {
        container.registerSingleton(token, implementation);
    });
}
