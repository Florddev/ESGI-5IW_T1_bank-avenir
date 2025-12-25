import 'reflect-metadata';
import { Scope, ClassRegistration } from './types';

class DIRegistry {
    private static instance: DIRegistry;
    private registrations = new Map<string, ClassRegistration>();

    private constructor() {}

    public static getInstance(): DIRegistry {
        if (!DIRegistry.instance) {
            DIRegistry.instance = new DIRegistry();
        }
        return DIRegistry.instance;
    }

    public register(registration: ClassRegistration): void {
        this.registrations.set(registration.token, registration);
    }

    public getAll(): ClassRegistration[] {
        return Array.from(this.registrations.values());
    }

    public get(token: string): ClassRegistration | undefined {
        return this.registrations.get(token);
    }

    public clear(): void {
        this.registrations.clear();
    }
}

export const getRegistry = () => DIRegistry.getInstance();

export function registerClass(
    token: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    implementation: new (...args: any[]) => any,
    scope: Scope = Scope.Transient
): void {
    getRegistry().register({
        token,
        implementation,
        scope,
    });
}
