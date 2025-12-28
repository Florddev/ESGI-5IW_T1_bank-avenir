import 'reflect-metadata';
import { registerInMemoryModule } from '@workspace/db-in-memory';

let isInitialized = false;

export function initializeDI() {
    if (isInitialized) {
        return;
    }

    registerInMemoryModule();

    isInitialized = true;
}
