export const CACHE_STRATEGIES = {
    /** No cache - Always fresh data (user transactions, account balance) */
    NO_CACHE: { revalidate: 0 } as const,
    /** Short cache - 30s (notifications, recent activity) */
    SHORT: { revalidate: 30 } as const,
    /** Medium cache - 5min (user accounts list, loans) */
    MEDIUM: { revalidate: 300 } as const,
    /** Long cache - 1h (public stocks, interest rates, static data) */
    LONG: { revalidate: 3600 } as const,
    /** Very long cache - 24h (legal documents, terms of service) */
    VERY_LONG: { revalidate: 86400 } as const,
} as const;

export interface NextFetchOptions {
    /**
     * Cache duration in seconds. Set to `false` to opt out of caching.
     * @default undefined (uses Next.js default behavior)
     * @see CACHE_STRATEGIES for recommended values
     */
    revalidate?: number | false;
    /**
     * Cache tags for selective revalidation.
     * @example ['accounts', 'user-123']
     */
    tags?: string[];
}

/**
 * Base client with Singleton pattern support.
 * Extend this class to create API clients with automatic singleton management.
 */
export abstract class BaseClient {
    private static instances = new Map<string, BaseClient>();

    /**
     * Get the singleton instance of a client class.
     * Creates the instance if it doesn't exist.
     * 
     * @param args - Constructor arguments (e.g., routesConfig)
     * @returns The singleton instance
     */
    public static getInstance<T extends BaseClient>(
        this: new (...args: any[]) => T,
        ...args: any[]
    ): T {
        const className = this.name;
        if (!BaseClient.instances.has(className)) {
            BaseClient.instances.set(className, new this(...args));
        }
        return BaseClient.instances.get(className) as T;
    }

    /**
     * Reset the singleton instance.
     * ⚠️ **For testing purposes only** - Do not use in production code.
     * 
     * @example
     * ```typescript
     * // In tests:
     * afterEach(() => {
     *   AuthClient.resetInstance();
     * });
     * ```
     */
    public static resetInstance(this: new (...args: any[]) => BaseClient): void {
        const className = this.name;
        BaseClient.instances.delete(className);
    }

    protected async request<T>(
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

        return response.json();
    }

    protected async get<T>(endpoint: string, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            next: next ?? CACHE_STRATEGIES.MEDIUM,
        });
    }

    protected async post<T>(endpoint: string, data?: unknown, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            next: next ?? CACHE_STRATEGIES.NO_CACHE,
        });
    }

    protected async put<T>(endpoint: string, data?: unknown, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            next: next ?? CACHE_STRATEGIES.NO_CACHE,
        });
    }

    protected async delete<T>(endpoint: string, next?: NextFetchOptions): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            next: next ?? CACHE_STRATEGIES.NO_CACHE,
        });
    }
}
