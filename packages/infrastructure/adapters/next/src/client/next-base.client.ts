import { BaseClient } from '@workspace/adapter-common/client';

export const CACHE_STRATEGIES = {
    NO_CACHE: { revalidate: 0 } as const,
    SHORT: { revalidate: 30 } as const,
    MEDIUM: { revalidate: 300 } as const,
    LONG: { revalidate: 3600 } as const,
    VERY_LONG: { revalidate: 86400 } as const,
} as const;

export interface NextFetchOptions {
    revalidate?: number | false;
    tags?: string[];
}

export class NextBaseClient extends BaseClient {
    protected override async request<T>(
        endpoint: string,
        options?: RequestInit & { next?: NextFetchOptions }
    ): Promise<T> {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            next: options?.next,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Request failed');
        }

        return (await response.json()).data as T;
    }

    protected override async get<T>(endpoint: string, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            next: next ?? CACHE_STRATEGIES.MEDIUM,
        });
    }

    protected override async post<T>(endpoint: string, data?: unknown, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            next: next ?? CACHE_STRATEGIES.NO_CACHE,
        });
    }

    protected override async put<T>(endpoint: string, data?: unknown, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            next: next ?? CACHE_STRATEGIES.NO_CACHE,
        });
    }

    protected override async delete<T>(endpoint: string, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            next: next ?? CACHE_STRATEGIES.NO_CACHE,
        });
    }
}
