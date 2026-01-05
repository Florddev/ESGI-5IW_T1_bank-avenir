export interface HttpRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: unknown;
}

export class BaseClient {
    private baseUrl: string = process.env.API_BASE_URL || ''; 
    private static instances = new Map<string, BaseClient>();

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

    public static resetInstance(this: new (...args: any[]) => BaseClient): void {
        const className = this.name;
        BaseClient.instances.delete(className);
    }

    protected async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Request failed');
        }

        const result = await response.json();
        if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
            return result.data as T;
        }

        return result as T;
    }

    protected async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'GET',
        });
    }

    protected async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'DELETE',
        });
    }

    protected async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}
