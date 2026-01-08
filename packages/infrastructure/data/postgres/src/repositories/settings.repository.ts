import { eq } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { ISettingsRepository } from '@workspace/application/ports';
import { Settings } from '@workspace/domain/entities';
import { Percentage } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { settings } from '../schema';

@Repository(TOKENS.ISettingsRepository)
export class PostgresSettingsRepository implements ISettingsRepository {
  private get db() {
    return getDatabase();
  }

  async get(): Promise<Settings> {
    const result = await this.db
      .select()
      .from(settings)
      .where(eq(settings.id, 'global-settings'))
      .limit(1);

    if (result.length === 0) {
      const defaultSettings = Settings.create(Percentage.fromDecimal(0.02)); // 2%
      await this.save(defaultSettings);
      return defaultSettings;
    }

    return this.rowToEntity(result[0]!);
  }

  async save(settingsEntity: Settings): Promise<Settings> {
    const values = {
      id: settingsEntity.id,
      savingsRate: settingsEntity.savingsRate.toDecimal().toString(),
      updatedAt: settingsEntity.updatedAt,
    };

    await this.db
      .insert(settings)
      .values(values)
      .onConflictDoUpdate({
        target: settings.id,
        set: values,
      });

    return settingsEntity;
  }

  private rowToEntity(row: typeof settings.$inferSelect): Settings {
    return Settings.fromPersistence({
      id: row.id,
      savingsRate: Percentage.fromDecimal(parseFloat(row.savingsRate)),
      updatedAt: row.updatedAt,
    });
  }
}
