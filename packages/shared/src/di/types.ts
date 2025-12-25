import { DependencyContainer } from 'tsyringe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = any> = new (...args: any[]) => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InjectionToken<T = any> = string | symbol | Constructor<T>;

export interface DIModule {
    name: string;
    register(container: DependencyContainer): void | Promise<void>;
    bootstrap?(): void | Promise<void>;
}

export enum Scope {
    Transient = 'transient',
    Singleton = 'singleton',
}

export interface ClassRegistration {
    token: string;
    implementation: Constructor;
    scope: Scope;
}
