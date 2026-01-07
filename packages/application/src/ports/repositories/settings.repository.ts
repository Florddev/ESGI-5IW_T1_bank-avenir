import type { Settings } from '@workspace/domain/entities';

export interface ISettingsRepository {
    get(): Promise<Settings>;
    save(settings: Settings): Promise<Settings>;
}
