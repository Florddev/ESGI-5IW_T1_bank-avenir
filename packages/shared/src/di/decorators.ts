import 'reflect-metadata';
import { injectable, inject as tsyringeInject } from 'tsyringe';
import { registerClass } from './registry';
import { Scope } from './types';

export function UseCase() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function <T extends { new (...args: any[]): object }>(constructor: T) {
        injectable()(constructor);
        registerClass(constructor.name, constructor, Scope.Singleton);
        Reflect.defineMetadata('di:usecase', true, constructor);
        return constructor;
    };
}

export function Injectable() {
    return injectable();
}

export function Inject(token: string) {
    return tsyringeInject(token);
}
