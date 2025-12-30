import 'reflect-metadata';
import { container as tsyringeContainer } from 'tsyringe';

export const container = tsyringeContainer;

export { TOKENS } from './tokens';
export type { Token } from './tokens';

export { UseCase, Injectable, Inject, Repository, REPOSITORY_METADATA } from './decorators';
export type { Constructor } from './decorators';
