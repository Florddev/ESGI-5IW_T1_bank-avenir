import { Repository, Inject, TOKENS } from '@workspace/shared/di';
import { SupabaseClientService } from '../supabase.client';
import type { IUserRepository } from '@workspace/application/ports';
import { User } from '@workspace/domain/entities';

@Repository(TOKENS.IUserRepository)
export class SupabaseUserRepository implements IUserRepository {
    constructor(
        @Inject(SupabaseClientService)
        private supabaseClient: SupabaseClientService
    ) {}

    async findById(id: string): Promise<User | null> {
        const { data, error } = await this.supabaseClient
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToDomain(data);
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await this.supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) return null;
        return this.mapToDomain(data);
    }

    async create(data: { email: string; password: string }): Promise<User> {
        const { data: user, error } = await this.supabaseClient
            .from('users')
            .insert({
                email: data.email,
                password: data.password,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.mapToDomain(user);
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabaseClient.from('users').delete().eq('id', id);

        if (error) throw new Error(error.message);
    }

    private mapToDomain(data: any): User {
        return new User(data.id, data.email, data.password, new Date(data.created_at));
    }
}
