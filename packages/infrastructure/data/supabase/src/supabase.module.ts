import { DependencyContainer } from 'tsyringe';
import { TOKENS } from '@nextstack/shared/di';
import { SupabaseClientService } from './supabase.client';
import { SupabaseUserRepository } from './repositories/supabase-user.repository';
import { SupabaseProductRepository } from './repositories/supabase-product.repository';

export function registerSupabaseModule(container: DependencyContainer): void {
    container.registerSingleton(SupabaseClientService, SupabaseClientService);
    container.registerSingleton(TOKENS.IUserRepository, SupabaseUserRepository);
    container.registerSingleton(TOKENS.IProductRepository, SupabaseProductRepository);
}
