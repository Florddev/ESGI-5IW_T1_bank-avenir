export interface StorageOptions {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export interface IStorageService {
    setToken(key: string, value: string, options?: StorageOptions): void;
    getToken(key: string): string | null;
    removeToken(key: string): void;
    hasToken(key: string): boolean;
}
