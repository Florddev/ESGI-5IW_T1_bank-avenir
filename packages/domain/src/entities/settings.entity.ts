import { Percentage } from '../value-objects/percentage';

export interface SettingsProps {
    id: string;
    savingsRate: Percentage;
    updatedAt: Date;
}

export class Settings {
    private constructor(private readonly props: SettingsProps) {}

    static create(savingsRate: Percentage): Settings {
        return new Settings({
            id: 'global-settings',
            savingsRate,
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: SettingsProps): Settings {
        return new Settings(props);
    }

    updateSavingsRate(newRate: Percentage): void {
        this.props.savingsRate = newRate;
        this.props.updatedAt = new Date();
    }

    get id(): string {
        return this.props.id;
    }

    get savingsRate(): Percentage {
        return this.props.savingsRate;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
