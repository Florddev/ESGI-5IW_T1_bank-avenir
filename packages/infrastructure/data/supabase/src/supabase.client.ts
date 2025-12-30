import { Injectable } from '@workspace/shared/di';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseClientService {
    private client: SupabaseClient;

    constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;

        if (!url || !key) {
            throw new Error('SUPABASE_URL and SUPABASE_KEY must be defined');
        }

        this.client = createClient(url, key);
    }

    getClient(): SupabaseClient {
        return this.client;
    }

    from(table: string) {
        return this.client.from(table);
    }

    get auth() {
        return this.client.auth;
    }

    get storage() {
        return this.client.storage;
    }
}
