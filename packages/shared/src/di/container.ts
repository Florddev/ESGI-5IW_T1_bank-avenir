import 'reflect-metadata';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';

class DIContainer {
    private static instance: DIContainer;
    private container: DependencyContainer;

    private constructor() {
        this.container = tsyringeContainer;
    }

    public static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    public getContainer(): DependencyContainer {
        return this.container;
    }

    public resolve<T>(token: string | { new (...args: unknown[]): T }): T {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.container.resolve<T>(token as any);
    }

    public reset(): void {
        this.container.reset();
    }
}

export const container = DIContainer.getInstance().getContainer();

export const resolve = <T>(token: string | { new (...args: unknown[]): T }): T => {
    return DIContainer.getInstance().resolve<T>(token);
};
