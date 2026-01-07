import type { ISettingsRepository } from '@workspace/application/ports';
import { Settings } from '@workspace/domain/entities';
import { Percentage } from '@workspace/domain/value-objects';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.ISettingsRepository)
export class InMemorySettingsRepository implements ISettingsRepository {
    private settings: Settings = Settings.create(Percentage.fromDecimal(0.025));

    async get(): Promise<Settings> {
        return this.settings;
    }

    async save(settings: Settings): Promise<Settings> {
        this.settings = settings;
        return settings;
    }
}
