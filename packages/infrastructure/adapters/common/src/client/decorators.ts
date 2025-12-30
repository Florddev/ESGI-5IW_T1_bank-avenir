import type { BaseClient } from './base.client';

const CLIENT_REGISTRY = new Map<string, new (...args: any[]) => BaseClient>();

export function ApiClient() {
    return function <T extends new (...args: any[]) => BaseClient>(target: T): T {
        CLIENT_REGISTRY.set(target.name, target);
        return target;
    };
}

export function getRegisteredClients(): Array<new (...args: any[]) => BaseClient> {
    return Array.from(CLIENT_REGISTRY.values());
}
