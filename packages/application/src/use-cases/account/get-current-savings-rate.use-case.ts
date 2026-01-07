import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { ISettingsRepository } from '../../ports';

@UseCase()
export class GetCurrentSavingsRateUseCase {
  constructor(
    @Inject(TOKENS.ISettingsRepository)
    private settingsRepository: ISettingsRepository
  ) {}

  async execute(): Promise<number> {
    const settings = await this.settingsRepository.get();
    return settings.savingsRate.toDecimal() * 100;
  }
}
